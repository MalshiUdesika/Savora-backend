const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reservationDate: {
      type: Date,
      required: true
    },

    reservationTime: {
      type: String,
      required: true
    },

    guestCount: {
      type: Number,
      required: true
    },

    tableNumber: {
      type: Number,
      default: null
    },

    specialRequest: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "cancelled",
        "completed"
      ],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
mongoose.model(
  "Reservation",
  reservationSchema
);