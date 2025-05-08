import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';

import { Hotel, MaxPrice } from '../shared/models/Hotel';
import { RoomService } from './room.service';

@Injectable()
export class HotelService {
  private readonly apiUrl = 'http://localhost:4000/api/v1/hotels';

  constructor(private http: HttpClient, private roomService: RoomService) {}

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  getAllCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/stats/cities`);
  }

  getMaxPrice(): Observable<MaxPrice> {
    return this.http.get<MaxPrice>(`${this.apiUrl}/stats/max-room-price`);
  }

  getHotelsByFilteredRooms(filters: any): Observable<Hotel[]> {
    console.log("FIlters: ",filters)
    return this.roomService.getRoomsByFilters(filters).pipe(
      switchMap((rooms) => {
        const hotelIds = [...new Set(rooms.map(room => room.hotel))];

        if (hotelIds.length === 0) return of([]);

        let hotelParams = new HttpParams();
        if (filters.location?.trim()) {
          hotelParams = hotelParams.set('city', filters.location.trim());
        }

        return this.http.get<Hotel[]>(this.apiUrl, { params: hotelParams }).pipe(
          map((hotels) => hotels.filter(hotel => hotelIds.includes(hotel._id)))
        );
      })
    );
  }
}
