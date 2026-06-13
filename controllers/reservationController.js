const Reservation = require("../models/Reservation");

const createReservation = async (
  req,
  res
) => {

  try {

    const {
      reservationDate,
      reservationTime,
      guestCount,
      specialRequest
    } = req.body;

    const reservation =
      await Reservation.create({

        user:
          req.user._id,

        reservationDate,

        reservationTime,

        guestCount,

        specialRequest

      });

    res.status(201).json({

      success: true,

      message:
        "Reservation created successfully",

      reservation

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getMyReservations =
async (
  req,
  res
) => {

  try {

    const reservations =
      await Reservation.find({

        user:
          req.user._id

      })

      .sort({
        createdAt: -1
      });

    res.json({

      success: true,

      reservations

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getReservations =
async (
  req,
  res
) => {

  try {

    const reservations =
      await Reservation.find()

      .populate(
        "user",
        "firstName lastName email"
      )

      .sort({
        createdAt: -1
      });

    res.json({

      success: true,

      count:
        reservations.length,

      reservations

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getReservationById =
async (
  req,
  res
) => {

  try {

    const reservation =
      await Reservation.findById(
        req.params.id
      )

      .populate(
        "user",
        "firstName lastName email"
      );

    if (!reservation) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Reservation not found"

      });

    }

    res.json({

      success: true,

      reservation

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const updateReservation =
async (
  req,
  res
) => {

  try {

    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Reservation not found"

      });

    }

    reservation.status =
      req.body.status ||
      reservation.status;

    reservation.tableNumber =
      req.body.tableNumber ||
      reservation.tableNumber;

    await reservation.save();

    res.json({

      success: true,

      message:
        "Reservation updated",

      reservation

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const deleteReservation =
async (
  req,
  res
) => {

  try {

    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Reservation not found"

      });

    }

    await reservation.deleteOne();

    res.json({

      success: true,

      message:
        "Reservation deleted"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

module.exports = {
  createReservation,
  getMyReservations,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
};