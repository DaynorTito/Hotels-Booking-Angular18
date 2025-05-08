import RoomService from "../../domain/services/RoomService.js";
import RoomRepository from "../../adapters/repositories/RoomRepository.js";
import HotelRepository from "../../adapters/repositories/HotelRepository.js";

class RoomController {
  constructor() {
    const roomRepository = new RoomRepository();
    const hotelRepository = new HotelRepository();
    this.roomService = new RoomService(roomRepository, hotelRepository);
  }

  createRoom = async (req, res, next) => {
    try {
      const roomData = req.body;
      const room = await this.roomService.createRoom(roomData);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  };

  getRoomById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const room = await this.roomService.getRoomById(id);
      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  };

  getAllRooms = async (req, res, next) => {
    try {
      const filters = req.query;
      const rooms = await this.roomService.getAllRooms(filters);
      res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  };

  updateRoom = async (req, res, next) => {
    try {
      const { id } = req.params;
      const roomData = req.body;
      const updatedRoom = await this.roomService.updateOrCreateRoom(
        id,
        roomData
      );
      res.status(200).json(updatedRoom);
    } catch (error) {
      next(error);
    }
  };

  deleteRoom = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.roomService.deleteRoom(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getRoomsByHotelId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const rooms = await this.roomService.getRoomsByHotelId(id);
      res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  };
}

export default RoomController;
