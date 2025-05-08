import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserLogin } from '../shared/models/User';

@Injectable()
export class AuthService {
  private readonly apiUrl = 'http://localhost:4000/api/v1/auth';

  private userSubject = new BehaviorSubject<UserLogin | null>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<UserLogin> {
    const loginData = { email, password };
    return this.http.post<UserLogin>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          this.userSubject.next(response);
        }
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    const registerData = { name, email, password };
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserFromStorage(): UserLogin | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) as UserLogin : null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
