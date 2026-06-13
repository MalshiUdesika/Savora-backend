const express =
require("express");

const router =
express.Router();

const {

  createCategory,

  getCategories,

  getCategoryById,

  updateCategory,

  deleteCategory

} = require(
  "../controllers/categoryController"
);

const protect =
require(
  "../middleware/jwtMiddleware"
);

const authorize =
require(
  "../middleware/roleMiddleware"
);


 /* Routes for Category */

router.post(
  "/",
  protect,
  authorize("admin"),
  createCategory
);

router.get(
  "/",
  getCategories
);

router.get(
  "/:id",
  getCategoryById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCategory
);

module.exports = router;