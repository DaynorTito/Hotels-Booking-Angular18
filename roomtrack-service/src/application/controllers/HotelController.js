import HotelService from "../../domain/services/HotelService.js";
import RoomService from "../../domain/services/RoomService.js";
import HotelRepository from "../../adapters/repositories/HotelRepository.js";
import RoomRepository from "../../adapters/repositories/RoomRepository.js";

class HotelController {
  constructor() {
    const hotelRepository = new HotelRepository();
    const roomRepository = new RoomRepository();
    this.hotelService = new HotelService(hotelRepository, roomRepository);
    this.roomService = new RoomService(roomRepository, hotelRepository);
  }

  createHotel = async (req, res, next) => {
    try {
      const hotelData = req.body;
      const hotel = await this.hotelService.createHotel(hotelData);
      if (hotelData.rooms && hotelData.rooms.length > 0) {
        await Promise.all(
          hotelData.rooms.map((roomData) =>
            this.roomService.createRoom({ ...roomData, hotel: hotel._id })
          )
        );
      }

      res.status(201).json(hotel);
    } catch (error) {
      next(error);
    }
  };

  getHotelById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const hotel = await this.hotelService.getHotelById(id);
      res.status(200).json(hotel);
    } catch (error) {
      next(error);
    }
  };

  getAllHotels = async (req, res, next) => {
    try {
      const filters = req.query;
      const hotels = await this.hotelService.getAllHotels(filters);
      console.log(hotels.length)
      res.status(200).json(hotels);
    } catch (error) {
      next(error);
    }
  };

  updateHotel = async (req, res, next) => {
    try {
      const { id } = req.params;
      const hotelData = req.body;

      const updatedHotel = await this.hotelService.updateHotel(id, hotelData);

      if (hotelData.rooms && hotelData.rooms.length > 0) {
        await Promise.all(
          hotelData.rooms.map((roomData) =>
            this.roomService.updateOrCreateRoom({ ...roomData, hotel: id })
          )
        );
      }

      res.status(200).json(updatedHotel);
    } catch (error) {
      next(error);
    }
  };

  deleteHotel = async (req, res, next) => {
    try {
      const { id } = req.params;

      await this.roomService.deleteRoomsByHotelId(id);

      const result = await this.hotelService.deleteHotel(id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllCities = async (req, res, next) => {
    try {
      const cities = await this.hotelService.getAllCities();
      res.status(200).json(cities);
    } catch (error) {
      next(error);
    }
  };

  getMaxRoomPrice = async (req, res, next) => {
    try {
      const maxPrice = await this.hotelService.getMaxRoomPrice();
      res.status(200).json({ maxPrice });
    } catch (error) {
      next(error);
    }
  };
}

export default HotelController;
