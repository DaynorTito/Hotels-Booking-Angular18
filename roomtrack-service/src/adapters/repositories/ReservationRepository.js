import { Reservation } from "../../infrastructure/database/mongoose/ReservationModel.js";

class ReservationRepository {
  async createReservation(reservationData) {
    const reservation = new Reservation(reservationData);
    return await reservation.save();
  }

  async getReservationById(id) {
    return await Reservation.findById(id)
      .populate("user")
      .populate("hotel")
      .populate("rooms.room");
  }

  async getAllReservations(filters = {}) {
    return await Reservation.find(filters)
      .populate("user")
      .populate("hotel")
      .populate("rooms.room")
      .sort({ createdAt: -1 });
  }

  async updateReservation(id, reservationData) {
    return await Reservation.findByIdAndUpdate(id, reservationData, {
      new: true
    });
  }

  async deleteReservation(id) {
    return await Reservation.findByIdAndDelete(id);
  }
}

export default ReservationRepository;
