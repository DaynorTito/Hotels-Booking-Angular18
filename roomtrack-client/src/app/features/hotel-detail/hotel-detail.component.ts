import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Bed, HandPlatter, Hotel as HotelIcon, LucideAngularModule } from 'lucide-angular';

import { Room } from '../../shared/models/Room';
import { Hotel } from '../../shared/models/Hotel';
import { HeaderComponentComponent } from "../header-component/header-component.component";
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { HotelMapComponent } from '../hotel-map/hotel-map.component';
import { HotelService } from '../../core/hotel.service';
import { RoomService } from '../../core/room.service';
import { FooterComponentComponent } from "../footer-component/footer-component.component";


@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [
    ImageCarouselComponent,
    HotelMapComponent,
    ReservationFormComponent,
    CommonModule,
    HeaderComponentComponent,
    FooterComponentComponent,
    LucideAngularModule
],
  providers: [HotelService, RoomService],
  templateUrl: './hotel-detail.component.html',
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly HandPlatterIcon = HandPlatter;
  readonly BedIcon = Bed;
  readonly HotelIcon = HotelIcon;
  hotel!: Hotel;
  hotelRooms!: Room[];

  constructor(private hotelService: HotelService, private roomService: RoomService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const hotelId = params['id'];
      if (hotelId) {
        this.fetchHotelDetails(hotelId);
      }
    });
  }

  fetchHotelDetails(id: string): void {
    this.hotelService.getHotelById(id)
      .subscribe({
        next: (data) => {
          this.hotel = data;
          this.fetchRooms(id);
        },
        error: (error) => {
          console.error('Error fetching hotel details', error);
        },
      });
  }

  fetchRooms(hotelId: string): void {
    this.roomService.getRoomsByHotelId(hotelId)
      .subscribe({
        next: (data) => {
          this.hotelRooms = data;
        },
        error: (error) => {
          console.error('Error fetching rooms', error);
        },
      });
  }

  get starsArray(): number[] {
    return Array(Math.floor(this.hotel?.rating || 0)).fill(0);
  }
}
