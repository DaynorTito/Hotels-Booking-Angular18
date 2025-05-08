import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-hotel-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-map.component.html',
  styleUrls: ['./hotel-map.component.scss']
})
export class HotelMapComponent implements AfterViewInit, OnDestroy {
  @Input() latitude!: number;
  @Input() longitude!: number;
  @Input() title!: string;
  @Input() location!: string;

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map: L.Map | null = null;

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    if (this.latitude === 0 && this.longitude === 0) {
      console.warn('Invalid coordinates provided to hotel-map component');
      return;
    }

    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map(this.mapContainer.nativeElement).setView([this.latitude, this.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup(this.title)
      .openPopup();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
