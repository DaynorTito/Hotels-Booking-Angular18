import { Hotel } from "./Hotel";
import { Room } from "./Room";
import { User } from "./User";

export interface ReservationRoom {
  room: Room;
  quantity: number;
  status: string;
  cancellationReason: string;
  _id?: string;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  email: string;
}

export interface Reservation {
  expanded: boolean;
  _id?: string;
  guestDetails: GuestDetails;
  user?: User;
  hotel: string | Hotel;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  rooms: ReservationRoom[];
  createdAt?: string;
  updatedAt?: string;
}


export interface ReservationPost {
  _id?: string;
  hotel: string;
  guestDetails: GuestDetails;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  rooms: {
    room: string;
    quantity: number;
    status: string;
  }[];
}
