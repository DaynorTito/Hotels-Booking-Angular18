import { Component, Input, OnChanges, SimpleChanges, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelCardComponent } from '../hotel-card/hotel-card.component';
import { Hotel } from '../../shared/models/Hotel';
import { HotelService } from '../../core/hotel.service';
import { RoomService } from '../../core/room.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, HotelCardComponent],
  providers: [HotelService, RoomService],
  templateUrl: './hotel-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelListComponent implements OnInit, OnChanges {
  @Input() filters: any = {};
  hotels: Hotel[] = [];

  constructor(private hotelService: HotelService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchHotels(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters) {
      console.log("📌 HotelListComponent received filters:", this.filters);
      this.fetchHotels(true);
    }
  }

  fetchHotels(useFilters: boolean): void {
    this.hotels = [];

    if (useFilters && Object.keys(this.filters).length > 0) {
      this.hotelService.getHotelsByFilteredRooms(this.filters).subscribe({
        next: (data) => {
          console.log("🏨 Hotels received:", data);
          this.hotels = [...data];
          this.cdr.markForCheck();
        },
        error: (err) => console.error('❌ Error fetching filtered hotels:', err)
      });
    } else {
      this.hotelService.getAllHotels().subscribe({
        next: (data) => {
          this.hotels = [...data];
          this.cdr.markForCheck();
        },
        error: (err) => console.error('❌ Error fetching hotels:', err)
      });
    }
  }

  onBookHotel(hotelId: string) {
    console.log('✅ Hotel booked with ID:', hotelId);
  }
}
