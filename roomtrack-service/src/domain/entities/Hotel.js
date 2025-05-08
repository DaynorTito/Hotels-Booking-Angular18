export class Hotel {
  constructor({ id, name, location, amenities, rating, images }) {
    this.id = id || null;
    this.name = name;
    this.location = location;
    this.amenities = amenities || [];
    this.rating = rating || 0;
    this.images = images || [];
  }
}
