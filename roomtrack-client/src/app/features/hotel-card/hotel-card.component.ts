import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapPin, Star, Calendar, LucideAngularModule, Map} from 'lucide-angular';

import { Hotel } from '../../shared/models/Hotel';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './hotel-card.component.html',
})
export class HotelCardComponent {
  readonly MapPinIcon = MapPin;
  readonly StarIcon = Star;
  readonly CalendarIcon = Calendar;
  readonly MapIcon = Map;
  isModalOpen = false;

  @Input() hotel!: Hotel;
  @Output() bookHotel = new EventEmitter<string>();

  constructor(private router: Router) {}

  onBook() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmBooking() {
    this.bookHotel.emit(this.hotel._id);
    this.closeModal();
  }

  navigateToDetail() {
    this.router.navigate(['/hotel', this.hotel._id]);
  }

  get starsArray(): number[] {
    return Array(Math.floor(this.hotel?.rating || 0)).fill(0);
  }
}
