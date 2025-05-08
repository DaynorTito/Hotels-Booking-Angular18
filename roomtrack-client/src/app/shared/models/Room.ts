export interface Room {
  _id: string;
  hotel: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
