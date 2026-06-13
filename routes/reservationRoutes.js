const express =
require("express");

const router =
express.Router();

const {

  createReservation,

  getMyReservations,

  getReservations,

  getReservationById,

  updateReservation,

  deleteReservation

} = require(
  "../controllers/reservationController"
);

const protect =
require(
  "../middleware/jwtMiddleware"
);

const authorize =
require(
  "../middleware/roleMiddleware"
);

router.post(
  "/",
  protect,
  createReservation
);

router.get(
  "/my",
  protect,
  getMyReservations
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getReservations
);

router.get(
  "/:id",
  protect,
  getReservationById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateReservation
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteReservation
);

module.exports = router;