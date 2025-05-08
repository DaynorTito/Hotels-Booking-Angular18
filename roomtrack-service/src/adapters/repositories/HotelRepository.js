import { Hotel } from "../../infrastructure/database/mongoose/HotelModel.js";

/**
 * @implements {HotelRepositoryPort}
 */
class HotelRepository {
  async createHotel(hotelData) {
    const hotel = new Hotel(hotelData);
    return await hotel.save();
  }

  async getHotelById(id) {
    return await Hotel.findById(id);
  }

  async getAllHotels(filters) {
    return await Hotel.find(filters).sort({ name: 1 });
  }

  async updateHotel(id, hotelData) {
    return await Hotel.findByIdAndUpdate(id, hotelData, { new: true });
  }

  async deleteHotel(id) {
    return await Hotel.findByIdAndDelete(id);
  }
}

export default HotelRepository;
