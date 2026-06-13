const express =
require("express");

const router =
express.Router();

const upload =
require(
  "../middleware/uploadMiddleware"
);

const {
  uploadImage
} = require(
  "../controllers/uploadController"
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

  upload.single("image"),

  uploadImage

);

module.exports =
router;