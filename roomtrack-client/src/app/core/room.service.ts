import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Room } from '../shared/models/Room';

@Injectable()
export class RoomService {
  private readonly apiUrl = 'http://localhost:4000/api/v1/rooms';

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getRoomsByHotelId(id: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/hotel/${id}`);
  }

  getRoomsByFilters(filters: any): Observable<Room[]> {
    let roomParams = new HttpParams();

    if (filters.minPrice) {
      roomParams = roomParams.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      roomParams = roomParams.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.roomType) {
      roomParams = roomParams.set('type', filters.roomType);
    }

    return this.http.get<Room[]>(this.apiUrl, { params: roomParams });
  }
}
