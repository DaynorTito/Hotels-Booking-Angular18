import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Reservation, ReservationRoom } from '../../shared/models/Reservation';
import { ReservationService } from '../../core/reservation.service';
import { dropdownAnimation } from '../../shared/animations/animations';
import { HeaderComponentComponent } from '../header-component/header-component.component';
import { FooterComponentComponent } from '../footer-component/footer-component.component';
import { HotelService } from '../../core/hotel.service';
import { Hotel } from '../../shared/models/Hotel';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../core/room.service';
import { AlertModalComponent } from "../alert-modal/alert-modal.component";

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponentComponent,
    FooterComponentComponent,
    FormsModule,
    AlertModalComponent
],
  providers: [ReservationService, HotelService, RoomService],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
  animations: [dropdownAnimation],
})
export class MyBookingsComponent implements OnInit {
  reservations$!: Observable<Reservation[]>;
  showModal = false;
  errorMessage = '';
  selectedReservation: Reservation | null = null;
  hotelCache: Map<string, Hotel> = new Map();
  cancelReason = '';

  modalTitle: string = '';
  modalMessage: string = '';
  modalVisible: boolean = false;
  isModalSuccess: boolean = true;

  constructor(
    private reservationService: ReservationService,
    private hotelService: HotelService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservations$ = this.reservationService.getUserReservations().pipe(
      map((reservations) => {
        reservations.forEach((reservation) => {
          if (typeof reservation.hotel === 'string') {
            this.fetchHotelData(reservation.hotel);
          }
        });
        return reservations;
      })
    );
  }

  toggleReservation(reservation: Reservation) {
    reservation.expanded = !reservation.expanded;
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status.toLowerCase()) {
      case 'pending':
        return `${baseClasses} bg-[#618725] bg-opacity-20 text-[#618725]`;
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  fetchHotelData(hotelId: string): void {
    if (!this.hotelCache.has(hotelId)) {
      this.hotelService.getHotelById(hotelId).subscribe(
        (hotelData) => {
          this.hotelCache.set(hotelId, hotelData);
        },
        (error) => {
          console.error(`Error fetching hotel with ID ${hotelId}:`, error);
        }
      );
    }
  }

  getHotelName(hotel: string | Hotel): string {
    if (typeof hotel === 'object') {
      return hotel.name;
    }

    if (this.hotelCache.has(hotel)) {
      return this.hotelCache.get(hotel)?.name || 'Unknown Hotel';
    }

    this.fetchHotelData(hotel);
    return 'Loading...';
  }

  getHotelLocation(hotel: string | Hotel): string {
    if (typeof hotel === 'object') {
      return `${hotel.location.address}, ${hotel.location.city}`;
    }

    if (this.hotelCache.has(hotel)) {
      const hotelData = this.hotelCache.get(hotel);
      return `${hotelData?.location.address}, ${hotelData?.location.city}`;
    }

    return 'Loading...';
  }

  getHotelImages(hotel: string | Hotel): string[] {
    if (typeof hotel === 'object') {
      return hotel.images || [];
    }

    if (this.hotelCache.has(hotel)) {
      return this.hotelCache.get(hotel)?.images || [];
    }

    return [];
  }

  getHotelAmenities(hotel: string | Hotel): string[] {
    if (typeof hotel === 'object') {
      return hotel.amenities || [];
    }

    if (this.hotelCache.has(hotel)) {
      return this.hotelCache.get(hotel)?.amenities || [];
    }

    return [];
  }

  getTotalNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getTotalGuests(rooms: ReservationRoom[]): number {
    return rooms.reduce((total, room) => {
      return total + room.room.capacity * room.quantity;
    }, 0);
  }

  getRoomsDescription(rooms: ReservationRoom[]): string {
    if (rooms.length === 0) return 'No rooms';

    const roomTypes = rooms.map(
      (room) =>
        `${room.quantity} ${room.room.type}${room.quantity > 1 ? 's' : ''}`
    );

    return roomTypes.join(', ');
  }

  showCancelModal(reservation: Reservation) {
    this.selectedReservation = reservation;
    this.showModal = true;
    this.cancelReason = '';
  }

  hideModal() {
    this.showModal = false;
    this.selectedReservation = null;
    this.cancelReason = '';
  }

  hideError() {
    this.errorMessage = '';
  }

  confirmCancel(reason: string) {
    if (!reason.trim()) {
      return;
    }

    if (this.selectedReservation?._id) {
      this.reservationService
        .cancelReservation(this.selectedReservation._id, reason)
        .pipe(
          catchError((error) => {
            this.showModal = false;
            this.errorMessage =
              error.error?.error?.message ||
              'Could not cancel reservation. Please try again later.';
            throw error;
          })
        )
        .subscribe(() => {
          this.hideModal();
          this.modalTitle = 'Reservation Cancelled';
          this.modalMessage =
            'Your reservation has been successfully cancelled.';
          this.isModalSuccess = true;
          this.modalVisible = true;

          setTimeout(() => {
            this.modalVisible = false;
            this.loadReservations();
          }, 700);
          this.loadReservations();
        });
    }
  }
}
