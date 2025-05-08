import { Room } from "../../infrastructure/database/mongoose/RoomModel.js";

class RoomRepository {
  async createRoom(roomData) {
    const room = new Room(roomData);
    return await room.save();
  }

  async getRoomById(id) {
    return await Room.findById(id);
  }

  async getAllRooms(filters) {
    return await Room.find(filters);
  }

  async updateRoom(id, roomData) {
    return await Room.findByIdAndUpdate(id, roomData, { new: true });
  }

  async deleteRoomsByHotelId(hotelId) {
    return await Room.deleteMany({ hotel: hotelId });
  }

  async deleteRoom(id) {
    return await Room.findByIdAndDelete(id);
  }

  async getRoomsByHotelId(hotelId) {
    return await Room.find({ hotel: hotelId });
  }

  async getMaxRoomPrice() {
    const maxRoom = await Room.findOne()
      .sort({ price: -1 })
      .select("price -_id");
    return maxRoom;
  }
}

export default RoomRepository;
