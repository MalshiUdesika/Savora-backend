const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    image: {
      type: String,
      default: ""
    },

    availability: {
      type: Boolean,
      default: true
    },

    ingredients: [{
      type: String
    }],

    preparationTime: {
      type: Number
    },

    rating: {
      type: Number,
      default: 0
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Food",
  foodSchema
);