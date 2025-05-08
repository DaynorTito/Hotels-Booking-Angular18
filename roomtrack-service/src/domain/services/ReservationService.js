import {
  INVALID_INPUT,
  RESOURCE_NOT_FOUND,
  UNAUTHORIZED
} from "../../application/utils/errors.js";

class ReservationService {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  /**
   * Private function to check the cancellation policy.
   * In this example, cancellation is only allowed if the request is made within 48 hours after creation.
   * @param {Object} reservation
   */
  _verifyCancellationPolicy(reservation) {
    console.log("RES ", reservation);

    const creationTime = new Date(reservation.createdAt);
    const checkInTime = new Date(reservation.checkInDate);
    const now = new Date();

    const hoursSinceCreation = (now - creationTime) / (1000 * 60 * 60);
    const daysUntilCheckIn = (checkInTime - now) / (1000 * 60 * 60 * 24);

    if (hoursSinceCreation > 48) {
      throw INVALID_INPUT(
        "Cancellation is only valid within 48 hours after the reservation is made."
      );
    }

    if (daysUntilCheckIn < 2) {
      throw INVALID_INPUT(
        "Cancellation is not allowed if the check-in date is tomorrow or sooner."
      );
    }
  }

  /**
   * Creates a new reservation.
   * The modificationCount is initialized to track future modifications.
   * @param {Object} reservationData
   */
  async createReservation(reservationData) {
    return await this.reservationRepository.createReservation(reservationData);
  }

  /**
   * Retrieves reservation details by its ID.
   * @param {String} id
   */
  async getReservationById(id, userId) {
    const reservation = await this.reservationRepository.getReservationById(id);
    if (!reservation) {
      throw RESOURCE_NOT_FOUND("Reservation");
    }
    if (!reservation.user._id.equals(userId)) {
      throw UNAUTHORIZED("Reservation not found for this user");
    }
    return reservation;
  }

  /**
   * Cancels the entire reservation.
   * Each room detail and the overall reservation status are marked as "cancelled."
   * Applies the cancellation policy (must be within 48 hours after creation).
   * @param {String} id
   * @param {String} reason
   */
  async cancelEntireReservation(id, reason, userId) {
    const reservation = await this.getReservationById(id, userId);
    this._verifyCancellationPolicy(reservation);

    const now = new Date();
    reservation.rooms.forEach((roomReservation) => {
      roomReservation.status = "cancelled";
      roomReservation.cancellationReason = reason;
      roomReservation.cancellationDate = now;
    });
    reservation.status = "cancelled";

    return await this.reservationRepository.updateReservation(id, reservation);
  }

  /**
   * Partially cancels specific rooms in the reservation.
   * The room (by its ID) and the number of rooms to cancel can be specified.
   * Applies the cancellation policy.
   * @param {String} id              Global reservation ID
   * @param {String} roomId          ID of the room to be canceled
   * @param {Number} cancelQuantity  Number of rooms to cancel
   * @param {String} reason          Reason for cancellation
   */
  async cancelPartialReservation(id, roomId, cancelQuantity, reason) {
    const reservation = await this.getReservationById(id);
    this._verifyCancellationPolicy(reservation);

    const now = new Date();
    const roomReservation = reservation.rooms.find(
      (item) =>
        item.room._id?.toString() === roomId || item.room.toString() === roomId
    );

    if (!roomReservation) {
      throw INVALID_INPUT("Room reservation not found");
    }

    if (cancelQuantity > roomReservation.quantity) {
      throw INVALID_INPUT(
        "The amount to be cancelled exceeds the amount reserved."
      );
    }

    if (cancelQuantity === roomReservation.quantity) {
      roomReservation.status = "cancelled";
      roomReservation.cancellationReason = reason;
      roomReservation.cancellationDate = now;
    } else {
      roomReservation.quantity -= cancelQuantity;
      reservation.rooms.push({
        room: roomReservation.room,
        quantity: cancelQuantity,
        status: "cancelled",
        cancellationReason: reason,
        cancellationDate: now
      });
    }

    const allCancelled = reservation.rooms.every(
      (item) => item.status === "cancelled"
    );
    if (allCancelled) {
      reservation.status = "cancelled";
    }

    return await this.reservationRepository.updateReservation(id, reservation);
  }

  /**
   * Updates the reservation (room quantity or dates).
   * Only up to 3 modifications are allowed.
   * @param {String} id
   * @param {Object} updateData
   */
  async updateReservation(id, updateData) {
    const reservation = await this.getReservationById(id);

    if ((reservation.modificationCount || 0) >= 3) {
      throw INVALID_INPUT("No further changes can be made to the reservation.");
    }

    updateData.modificationCount = (reservation.modificationCount || 0) + 1;

    const updatedReservation =
      await this.reservationRepository.updateReservation(id, updateData);
    return updatedReservation;
  }

  /**
   * Retrieves reservations for a given user.
   * Optionally filter by reservation status.
   * @param {string} userId - ID of the user
   * @param {string} [status] - Optional status filter ("confirmed", "pending", "cancelled")
   * @returns {Promise<Array>}
   */
  async getReservationsByUser(userId, status) {
    const filters = { user: userId };
    if (status) {
      filters.status = status;
    }
    return await this.reservationRepository.getAllReservations(filters);
  }
}

export default ReservationService;
