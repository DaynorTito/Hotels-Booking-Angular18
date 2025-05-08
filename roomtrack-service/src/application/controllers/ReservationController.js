import ReservationService from "../../domain/services/ReservationService.js";
import ReservationRepository from "../../adapters/repositories/ReservationRepository.js";

class ReservationController {
  constructor() {
    const reservationRepository = new ReservationRepository();
    this.reservationService = new ReservationService(reservationRepository);
  }

  createReservation = async (req, res, next) => {
    try {
      const reservationData = req.body;
      const userId = req.user.id;
      reservationData.user = userId;
      const reservation =
        await this.reservationService.createReservation(reservationData);
      res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  getReservationById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const reservation = await this.reservationService.getReservationById(
        id,
        userId
      );
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  updateReservation = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedReservation =
        await this.reservationService.updateReservation(id, updateData);
      res.status(200).json(updatedReservation);
    } catch (error) {
      next(error);
    }
  };

  cancelEntireReservation = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;
      const reservation = await this.reservationService.cancelEntireReservation(
        id,
        reason,
        userId
      );
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  cancelPartialReservation = async (req, res, next) => {
    try {
      const { id, roomId } = req.params;
      const { cancelQuantity, reason } = req.body;
      const reservation =
        await this.reservationService.cancelPartialReservation(
          id,
          roomId,
          cancelQuantity,
          reason
        );
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  getReservationsByUser = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { status } = req.query;
      const reservations = await this.reservationService.getReservationsByUser(
        userId,
        status
      );
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };
}

export default ReservationController;
