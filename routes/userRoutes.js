const express =
  require("express");

const router =
  express.Router();


const authorize =
require("../middleware/roleMiddleware");

const {
  registerUser,
  verifyOTP,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  resendOTP,
  createAdmin
} = require(
  "../controllers/userController"
);

const protect =
  require(
    "../middleware/jwtMiddleware"
  );

router.post(
  "/register",
  registerUser
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/profile",
  protect,
  getProfile,
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);


router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

router.post(
  "/resend-otp",
  resendOTP
);

router.get(
  "/admin-test",
  protect,
  authorize("admin"),
  (req, res) => {

    res.json({
      success: true,
      message:
        "Welcome Admin"
    });

  }
);

router.post(
  "/create-admin",
  protect,
  authorize("admin"),
  createAdmin
);

module.exports = router;
