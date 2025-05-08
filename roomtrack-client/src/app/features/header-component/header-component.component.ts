import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from '../filters/filters.component';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, CircleUserRound, Calendar, LogOut, ListFilter, X, Search } from 'lucide-angular';
import { filter, Observable, Subscription } from 'rxjs';

import { UserLogin } from '../../shared/models/User';
import { AuthService } from '../../core/auth.service';
import { dropdownAnimation } from '../../shared/animations/animations';
import { HotelService } from '../../core/hotel.service';
import { RoomService } from '../../core/room.service';
import { FilterChip } from '../../shared/models/Hotel';
@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, FiltersComponent, FormsModule, CommonModule],
  templateUrl: './header-component.component.html',
  providers: [AuthService, RouterLink, HotelService, RoomService],
  styleUrls: ['./header-component.component.scss'],
  animations: [dropdownAnimation],
})
export class HeaderComponentComponent implements OnInit {
  readonly CircleUserRoundIcon = CircleUserRound;
  readonly CalendarIcon = Calendar;
  readonly LogoutIcon = LogOut;
  readonly FiltersIcon = ListFilter;
  readonly CloseIcon = X;
  readonly SearchIcon = Search;
  readonly logoPath = 'assets/logo.png';
  private routerSubscription: Subscription | undefined;

  isFiltersOpen = false;
  showSearchBar = true;
  user$: Observable<UserLogin | null>;
  dropdownOpen = false;
  activeFilters: FilterChip[] = [];
  searchQuery: string = '';
  currentFilters: any = {};

  @Output() filtersChanged = new EventEmitter<any>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private hotelService: HotelService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showSearchBar = !event.url.includes('/hotel/') && !event.url.includes('/mybookings');
    });

    const currentUrl = this.router.url;
    this.showSearchBar = !currentUrl.includes('/hotel/') && !currentUrl.includes('/mybookings');
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  openFilters() {
    this.isFiltersOpen = true;
  }

  closeFilters() {
    this.isFiltersOpen = false;
  }

  applyFilters(filters: any) {
    this.currentFilters = filters;
    this.updateFilterChips(filters);
    this.filtersChanged.emit(filters);
    this.closeFilters();
  }

  updateFilterChips(filters: any) {
    this.activeFilters = [];
    if (filters.name) {
      this.activeFilters.push({
        type: 'name',
        value: filters.name,
        displayValue: `"${filters.name}"`
      });
    }
    if (filters.location) {
      this.activeFilters.push({
        type: 'location',
        value: filters.location,
        displayValue: filters.location
      });
    }
    if (filters.roomType) {
      this.activeFilters.push({
        type: 'roomType',
        value: filters.roomType,
        displayValue: filters.roomType
      });
    }
    if (filters.guests > 1) {
      this.activeFilters.push({
        type: 'guests',
        value: filters.guests.toString(),
        displayValue: `${filters.guests} huéspedes`
      });
    }
    if (filters.minPrice > 0 || filters.maxPrice < this.getMaxPriceDefault()) {
      this.activeFilters.push({
        type: 'price',
        value: `${filters.minPrice}-${filters.maxPrice}`,
        displayValue: `$${filters.minPrice} - $${filters.maxPrice}`
      });
    }
  }

  getMaxPriceDefault(): number {
    return 1000;
  }

  removeFilter(chip: FilterChip) {
    this.activeFilters = this.activeFilters.filter(c =>
      !(c.type === chip.type && c.value === chip.value)
    );
    switch(chip.type) {
      case 'name':
        this.currentFilters.name = '';
        break;
      case 'location':
        this.currentFilters.location = '';
        break;
      case 'roomType':
        this.currentFilters.roomType = null;
        break;
      case 'guests':
        this.currentFilters.guests = 1;
        break;
      case 'price':
        this.currentFilters.minPrice = 0;
        this.currentFilters.maxPrice = this.getMaxPriceDefault();
        break;
    }
    this.filtersChanged.emit(this.currentFilters);
  }

  clearAllFilters() {
    this.activeFilters = [];
    this.currentFilters = {
      minPrice: 0,
      maxPrice: this.getMaxPriceDefault(),
      guests: 1,
      roomType: null,
      location: '',
      name: ''
    };
    this.filtersChanged.emit(this.currentFilters);
  }

  searchByName() {
    if (this.searchQuery.trim()) {
      this.currentFilters.name = this.searchQuery.trim();
      this.updateFilterChips(this.currentFilters);
      this.filtersChanged.emit(this.currentFilters);
      this.searchQuery = '';
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
