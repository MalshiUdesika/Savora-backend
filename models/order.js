const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(

  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation"
    },

    foods: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "card"
      ],
      default: "cash"
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled"
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
  "Order",
  orderSchema
);