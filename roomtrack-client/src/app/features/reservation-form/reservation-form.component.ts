import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {
  BookUser,
  LucideAngularModule,
  AlertTriangle,
  Calendar,
  CalendarDays,
  CalendarX,
  Calculator,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  XCircle,
  Bed,
  BedDouble,
} from 'lucide-angular';

import { ReservationPost } from '../../shared/models/Reservation';
import { Room } from '../../shared/models/Room';
import { ReservationService } from '../../core/reservation.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { AuthService } from '../../core/auth.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AuthModalComponent,
    LucideAngularModule,
    AlertModalComponent,
  ],
  providers: [ReservationService, AuthService],
  templateUrl: './reservation-form.component.html',
})
export class ReservationFormComponent implements OnInit {
  bookingForm!: FormGroup;
  totalPrice = 0;
  selectedRoomsCount = 0;
  nights = 0;
  isSubmitting = false;
  bookingSuccess = false;
  confirmationNumber = '';
  showAuthModal = false;
  modalTitle: string = '';
  modalMessage: string = '';
  modalVisible: boolean = false;
  isModalSuccess: boolean = true;

  readonly GuestIcon = BookUser;
  readonly BedDoubleIcon = BedDouble;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly CalendarIcon = Calendar;
  readonly CalendarDaysIcon = CalendarDays;
  readonly CalendarXIcon = CalendarX;
  readonly CalculatorIcon = Calculator;
  readonly CheckCircleIcon = CheckCircle;
  readonly MailIcon = Mail;
  readonly MapPinIcon = MapPin;
  readonly PhoneIcon = Phone;
  readonly UserIcon = User;
  readonly UsersIcon = Users;
  readonly XCircleIcon = XCircle;
  readonly BedIcon = Bed;

  private fb = inject(FormBuilder);

  @Input() hotelId!: string;
  @Input() rooms!: Room[];

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  get guestDetails() {
    return this.bookingForm.get('guestDetails');
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const roomControls: Record<string, any> = {};
    this.rooms.forEach((room) => {
      roomControls[`room_${room._id}`] = [0];
    });

    this.bookingForm = this.fb.group(
      {
        ...roomControls,
        checkInDate: ['', Validators.required],
        checkOutDate: ['', Validators.required],
        guestDetails: this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', Validators.required],
          address: ['', Validators.required],
        }),
      },
      { validators: this.dateRangeValidator }
    );
  }

  dateRangeValidator: ValidatorFn = (
    formGroup: AbstractControl
  ): ValidationErrors | null => {
    const checkInDate = formGroup.get('checkInDate')?.value;
    const checkOutDate = formGroup.get('checkOutDate')?.value;
    const today = new Date().setHours(0, 0, 0, 0);

    if (!checkInDate || !checkOutDate) return null;

    const checkIn = new Date(checkInDate).setHours(0, 0, 0, 0);
    const checkOut = new Date(checkOutDate).setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return { pastCheckInDate: true };
    }

    if (checkIn >= checkOut) {
      return { invalidDateRange: true };
    }

    return null;
  };

  setMinDates(): void {
    const today = new Date().toISOString().split('T')[0];
    this.bookingForm.get('checkInDate')?.setValue(today);
    this.bookingForm.get('checkOutDate')?.setValue(today);
  }

  updateTotalPrice(): void {
    const checkInDate = this.bookingForm.get('checkInDate')?.value;
    const checkOutDate = this.bookingForm.get('checkOutDate')?.value;

    if (!checkInDate || !checkOutDate) {
      this.totalPrice = 0;
      this.nights = 0;
      return;
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    this.nights = Math.max(
      0,
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    if (this.nights <= 0) {
      this.totalPrice = 0;
      return;
    }

    let totalRoomPrice = 0;
    this.selectedRoomsCount = 0;

    this.rooms.forEach((room) => {
      const controlName = `room_${room._id}`;
      const quantity = parseInt(
        this.bookingForm.get(controlName)?.value || '0'
      );

      if (quantity > 0) {
        totalRoomPrice += room.price * quantity;
        this.selectedRoomsCount += quantity;
      }
    });

    this.totalPrice = totalRoomPrice * this.nights;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || this.totalPrice === 0) {
      this.markFormGroupTouched(this.bookingForm);
      return;
    }

    if (!this.authService.getUserFromStorage()) {
      this.showAuthModal = true;
      return;
    }

    this.processReservation();
  }

  processReservation(): void {
    this.isSubmitting = true;
  
    const bookingRequest: ReservationPost = {
      hotel: this.hotelId,
      guestDetails: this.bookingForm.get('guestDetails')?.value,
      checkInDate: new Date(this.bookingForm.get('checkInDate')?.value).toISOString(),
      checkOutDate: new Date(this.bookingForm.get('checkOutDate')?.value).toISOString(),
      totalPrice: this.totalPrice,
      status: 'pending',
      rooms: []
    };
  
    // Agregar habitaciones seleccionadas
    this.rooms.forEach((room) => {
      const controlName = `room_${room._id}`;
      const quantity = parseInt(this.bookingForm.get(controlName)?.value || '0');
  
      if (quantity > 0) {
        bookingRequest.rooms.push({
          room: room._id,
          quantity,
          status: 'confirmed'
        });
      }
    });
  
    this.reservationService.createReservation(bookingRequest).subscribe({
      next: (response) => {
        this.modalTitle = 'Reservation Registered';
        this.modalMessage = 'Your reservation has been successfully registered.';
        this.isModalSuccess = true;
        this.modalVisible = true;
  
        setTimeout(() => {
          this.modalVisible = false;
        }, 700);
  
        this.isSubmitting = false;
        this.bookingSuccess = true;
        this.bookingForm.reset();
  
        // Depuración: Ver qué devuelve el backend
        console.log("Booking response:", response);
        console.log("Extracted confirmation ID:", response?._id);
        

  
        this.confirmationNumber = `BOOKING-${response?._id || 'UNKNOWN'}`;


  
        // Reiniciar valores de los campos de habitaciones
        this.rooms.forEach((room) => {
          this.bookingForm.get(`room_${room._id}`)?.setValue(0);
        });
  
        this.totalPrice = 0;
        this.selectedRoomsCount = 0;
        this.nights = 0;
      },
      error: (error) => {
        this.isSubmitting = false;
  
        this.modalTitle = 'Register Reservation Failed';
        this.modalMessage = error.error?.error?.message || 'Could not create reservation. Please try again later.';
        this.isModalSuccess = false;
        this.modalVisible = true;
  
        console.error('Error creating booking', error);
      }
    });
  }
  

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  handleCloseModal(): void {
    this.showAuthModal = false;
  }

  navigateToBookings(): void {
    this.router.navigate(['/mybookings']);
  }
}
