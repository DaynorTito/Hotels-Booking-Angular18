export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  city: string;
  coordinates?: Coordinates;
}

export interface Hotel {
  _id: string;
  name: string;
  price: number;
  location: Location;
  rating: number;
  images: string[];
  amenities: string[];
  rooms: string[];
}

export interface MaxPrice {
  maxPrice: number;
}

export interface FilterChip {
  type: string;
  value: string;
  displayValue: string;
}
