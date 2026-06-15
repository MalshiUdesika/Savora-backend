const express =
require("express");

const router =
express.Router();

const {

  createOrder,

  getMyOrders,

  getOrders,

  getOrderById,

  updateOrder,

  deleteOrder

} = require(
  "../controllers/orderController"
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
  createOrder
);

router.get(
  "/my",
  protect,
  getMyOrders
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getOrders
);

router.get(
  "/:id",
  protect,
  getOrderById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateOrder
);

router.delete(
  "/:id",
  protect,
  deleteOrder
);

module.exports = router;