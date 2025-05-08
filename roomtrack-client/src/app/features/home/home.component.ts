import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponentComponent } from '../footer-component/footer-component.component';
import { HeaderComponentComponent } from '../header-component/header-component.component';
import { HotelListComponent } from '../hotel-list/hotel-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponentComponent,
    HeaderComponentComponent,
    HotelListComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  hotelFilters: any = {};
}
