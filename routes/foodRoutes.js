const express =
require("express");

const router =
express.Router();

const {

  createFood,

  getFoods,

  getFoodById,

  updateFood,

  deleteFood

} = require(
  "../controllers/foodController"
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
  authorize("admin"),
  createFood
);

router.get(
  "/",
  getFoods
);

router.get(
  "/:id",
  getFoodById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFood
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFood
);

module.exports = router;