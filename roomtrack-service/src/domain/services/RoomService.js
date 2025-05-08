import { RESOURCE_NOT_FOUND } from "../../application/utils/errors.js";

class RoomService {
  constructor(roomRepository, hotelRepository) {
    this.roomRepository = roomRepository;
    this.hotelRepository = hotelRepository;
  }

  async createRoom(roomData) {
    const newRoom = await this.roomRepository.createRoom(roomData);
    await this.hotelRepository.updateHotel(roomData.hotel, {
      $push: { rooms: newRoom._id }
    });
    return newRoom;
  }

  async getRoomById(id) {
    const room = await this.roomRepository.getRoomById(id);
    if (!room) {
      throw RESOURCE_NOT_FOUND("Room");
    }
    return room;
  }

  async getAllRooms(filters = {}) {
    const query = {};

    if (filters.capacity) {
      query.capacity = parseInt(filters.capacity);
    }

    if (filters.type) {
      query.type = { $regex: filters.type, $options: "i" };
    }

    if (filters.amenities) {
      const amenitiesArray = filters.amenities.split(",");
      query.amenities = { $all: amenitiesArray };
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }

    return await this.roomRepository.getAllRooms(query);
  }

  async updateOrCreateRoom(id, roomData) {
    const existingRoom = await this.roomRepository.getRoomById(id);
    if (existingRoom) {
      return await this.roomRepository.updateRoom(id, roomData);
    } else {
      return await this.roomRepository.createRoom(roomData);
    }
  }

  async deleteRoomsByHotelId(hotelId) {
    return await this.roomRepository.deleteRoomsByHotelId(hotelId);
  }

  async deleteRoom(id) {
    const result = await this.roomRepository.deleteRoom(id);
    if (!result) {
      throw RESOURCE_NOT_FOUND("Room");
    }
    return result;
  }

  async getRoomsByHotelId(id) {
    return await this.roomRepository.getRoomsByHotelId(id);
  }
}

export default RoomService;
