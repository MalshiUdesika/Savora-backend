const Order = require("../models/order");
const Food = require("../models/food");
const Reservation = require("../models/reservation");

const createOrder = async (
  req,
  res
) => {

  try {

    const {
      reservation,
      foods,
      paymentMethod
    } = req.body;

    let totalAmount = 0;

    for (const item of foods) {

      const food =
        await Food.findById(
          item.food
        );

      if (!food) {

        return res.status(404)
        .json({
          success: false,
          message:
            "Food not found"
        });

      }

      totalAmount +=
        food.price *
        item.quantity;

    }

    const order =
      await Order.create({

        user:
          req.user._id,

        reservation,

        foods,

        totalAmount,

        paymentMethod

      });

    res.status(201).json({

      success: true,

      message:
        "Order created successfully",

      order

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getMyOrders = async (
  req,
  res
) => {

  try {

    const orders =
      await Order.find({

        user:
          req.user._id

      })

      .populate(
        "foods.food",
        "name price image"
      )

      .populate(
        "reservation"
      )

      .sort({
        createdAt: -1
      });

    res.json({

      success: true,

      orders

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getOrders = async (
  req,
  res
) => {

  try {

    const orders =
      await Order.find()

      .populate(
        "user",
        "firstName lastName email"
      )

      .populate(
        "foods.food",
        "name price"
      )

      .sort({
        createdAt: -1
      });

    res.json({

      success: true,

      count:
        orders.length,

      orders

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const getOrderById = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      )

      .populate(
        "user",
        "firstName lastName email"
      )

      .populate(
        "foods.food"
      )

      .populate(
        "reservation"
      );

    if (!order) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Order not found"

      });

    }

    res.json({

      success: true,

      order

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const updateOrder = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Order not found"

      });

    }

    order.status =
      req.body.status ||
      order.status;

    await order.save();

    res.json({

      success: true,

      message:
        "Order updated",

      order

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

const deleteOrder = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404)
      .json({

        success: false,

        message:
          "Order not found"

      });

    }

    await order.deleteOne();

    res.json({

      success: true,

      message:
        "Order cancelled"

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
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};