import { Component, EventEmitter, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  LucideAngularModule,
  ChevronDown,
  X,
  Sliders,
  MapPin,
  Users,
  Check,
  Search,
} from 'lucide-angular';
import { HotelService } from '../../core/hotel.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  isFiltersOpen = true;
  minPrice = 0;
  maxPrice = 1000;
  systemMaxPrice = 1000;

  guests = 1;
  selectedRoom: string | null = null;
  selectedLocation: string = '';
  searchName: string = '';

  cities = signal<string[]>([]);
  isLoading = signal(true);

  readonly CloseIcon = X;
  readonly SliderIcon = Sliders;
  readonly LocationIcon = MapPin;
  readonly UsersIcon = Users;
  readonly ExpandIcon = ChevronDown;
  readonly CheckIcon = Check;
  readonly SearchIcon = Search;

  @Output() filtersApplied = new EventEmitter<{
    minPrice: number;
    maxPrice: number;
    guests: number;
    roomType: string | null;
    location: string;
    name: string;
  }>();
  @Output() close = new EventEmitter<void>();

  roomTypes = ['Single', 'Double', 'Triple', 'Suite', 'Suite with Extra Bed'];

  private subscriptions: Subscription[] = [];

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.isLoading.set(true);

    this.subscriptions.push(
      this.hotelService.getAllCities().subscribe({
        next: (data) => {
          this.cities.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching cities:', err);
          this.isLoading.set(false);
        },
      })
    );

    this.subscriptions.push(
      this.hotelService.getMaxPrice().subscribe({
        next: (data) => {
          this.systemMaxPrice = data.maxPrice;
          this.maxPrice = data.maxPrice;
        },
        error: (err) => {
          console.error('Error fetching max price:', err);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  closeFilters(): void {
    this.isFiltersOpen = false;
    this.close.emit();
  }

  applyFilters(): void {
    this.filtersApplied.emit({
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      guests: this.guests,
      roomType: this.selectedRoom,
      location: this.selectedLocation,
      name: this.searchName,
    });
    this.closeFilters();
  }

  clearFilters(): void {
    this.minPrice = 0;
    this.maxPrice = this.systemMaxPrice;
    this.guests = 1;
    this.selectedRoom = null;
    this.selectedLocation = '';
    this.searchName = '';
  }

  updateMinPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.minPrice = Number(input.value);
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice;
    }
  }

  updateMaxPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.maxPrice = Number(input.value);
    if (this.maxPrice < this.minPrice) {
      this.minPrice = this.maxPrice;
    }
  }

  updateGuests(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.guests = Math.max(1, Number(input.value));
  }

  selectRoom(room: string): void {
    this.selectedRoom = this.selectedRoom === room ? null : room;
  }

  selectLocation(city: string): void {
    this.selectedLocation = city;
  }

  hasActiveFilters(): boolean {
    return (
      this.minPrice > 0 ||
      this.maxPrice < this.systemMaxPrice ||
      this.guests > 1 ||
      this.selectedRoom !== null ||
      this.selectedLocation !== '' ||
      this.searchName !== ''
    );
  }
}
