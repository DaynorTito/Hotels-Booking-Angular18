import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Reservation, ReservationPost } from '../shared/models/Reservation';

@Injectable()
export class ReservationService {
  private readonly apiUrl = 'http://localhost:4000/api/v1/reservations';

  constructor(private http: HttpClient) {}

  createReservation(reservation: ReservationPost): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }
  

  getUserReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/books`);
  }

  cancelReservation(id: string, reason: string): Observable<ReservationPost> {
    return this.http.post<ReservationPost>(`${this.apiUrl}/${id}/cancel`, {
      reason,
    });
  }
}
