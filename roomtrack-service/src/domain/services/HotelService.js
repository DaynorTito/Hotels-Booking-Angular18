import { RESOURCE_NOT_FOUND } from "../../application/utils/errors.js";

class HotelService {
  constructor(hotelRepository, roomRepository) {
    this.hotelRepository = hotelRepository;
    this.roomRepository = roomRepository;
  }

  async createHotel(hotelData) {
    return await this.hotelRepository.createHotel(hotelData);
  }

  async getHotelById(id) {
    const hotel = await this.hotelRepository.getHotelById(id);
    if (!hotel) {
      throw RESOURCE_NOT_FOUND("Hotel");
    }
    return hotel;
  }

  async getAllHotels(filters = {}) {
    const query = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    if (filters.city) {
      query["location.city"] = { $regex: filters.city, $options: "i" };
    }

    if (filters.minRating || filters.maxRating) {
      query.rating = {};
      if (filters.minRating) query.rating.$gte = parseFloat(filters.minRating);
      if (filters.maxRating) query.rating.$lte = parseFloat(filters.maxRating);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $all: filters.amenities };
    }

    if (
      filters.minPrice ||
      filters.maxPrice ||
      filters.capacity ||
      filters.type
    ) {
      const roomFilters = {};

      if (filters.minPrice || filters.maxPrice) {
        roomFilters.price = {};
        if (filters.minPrice)
          roomFilters.price.$gte = parseFloat(filters.minPrice);
        if (filters.maxPrice)
          roomFilters.price.$lte = parseFloat(filters.maxPrice);
      }

      if (filters.capacity) {
        roomFilters.capacity = parseInt(filters.capacity);
      }

      if (filters.type) {
        roomFilters.type = { $regex: filters.type, $options: "i" };
      }

      const filteredRooms = await this.roomRepository.getAllRooms(roomFilters);
      const hotelIds = [...new Set(filteredRooms.map((room) => room.hotel))];

      query["_id"] = { $in: hotelIds };
    }

    return await this.hotelRepository.getAllHotels(query);
  }

  async deleteHotel(id) {
    const hotel = await this.hotelRepository.getHotelById(id);
    if (!hotel) {
      throw RESOURCE_NOT_FOUND("Hotel");
    }
    await this.roomRepository.deleteRoomsByHotelId(id);
    const result = await this.hotelRepository.deleteHotel(id);
    return result;
  }

  async getMaxRoomPrice() {
    const maxRoom = await this.roomRepository.getMaxRoomPrice();
    return maxRoom?.price || 0;
  }

  async getAllCities() {
    const cities = await this.hotelRepository.getAllHotels(
      {},
      { "location.city": 1, _id: 0 }
    );
    const uniqueCities = [
      ...new Set(cities.map((hotel) => hotel.location.city))
    ];
    return uniqueCities;
  }
}

export default HotelService;
