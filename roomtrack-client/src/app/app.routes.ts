import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    title: 'RoomTrack Hotels',
    component: HomeComponent,
  },
  {
    path: 'login',
    title: 'RoomTrack Login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
    data: { animation: 'loginPage' },
  },
  {
    path: 'register',
    title: 'RoomTrack Register',
    loadComponent: () =>
      import('./features/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: { animation: 'registerPage' },
  },
  {
    path: 'hotel/:id',
    loadComponent: () =>
      import('./features/hotel-detail/hotel-detail.component').then(
        (m) => m.HotelDetailComponent
      ),
    data: { animation: 'hotelDetailsPage' },
  },
  {
    path: 'mybookings',
    loadComponent: () =>
      import('./features/my-bookings/my-bookings.component').then(
        (m) => m.MyBookingsComponent
      ),
    data: { animation: 'myBookingsPage' },
  },
  {
    path: '**',
    title: 'Page Not Found',
    component: PageNotFoundComponent,
    data: { animation: 'notFoundPage' },
  },
];
