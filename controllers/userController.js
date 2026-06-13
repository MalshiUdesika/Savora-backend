const bcrypt = require("bcryptjs");

const User = require("../models/user");
const OTP = require("../models/otp");

const generateOTP = require("../utils/generateOTP");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {

  console.log("BODY RECEIVED:", req.body);

  try {

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing"
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone
    });

    const otp = generateOTP();

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      )
    });

   console.log("OTP FOR TESTING:", otp);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      otp
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord =
      await OTP.findOne({
        email,
        otp
      });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (
      otpRecord.expiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "OTP Expired"
      });
    }
	

    await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    );

    await OTP.deleteMany({
      email
    });

    res.json({
      success: true,
      message:
        "Email verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Please verify email first"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid credentials"
      });
    }

    res.json({
      success: true,
      token: generateToken(
        user._id
      ),
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {

  res.status(200).json({
    success: true,
    user: req.user
  });

};

const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.firstName =
      req.body.firstName || user.firstName;

    user.lastName =
      req.body.lastName || user.lastName;

    user.phone =
      req.body.phone || user.phone;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await OTP.deleteMany({
      email
    });

    const otp = generateOTP();

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      )
    });

    console.log(
      "PASSWORD RESET OTP:",
      otp
    );

    res.status(200).json({
      success: true,
      message:
        "Password reset OTP generated",
      otp
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      newPassword
    } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    await user.save();

    await OTP.deleteMany({
      email
    });

    res.status(200).json({
      success: true,
      message:
        "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const resendOTP = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete old OTPs
    await OTP.deleteMany({
      email
    });

    // Generate new OTP
    const otp = generateOTP();

    // Save new OTP
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      )
    });

    console.log("NEW OTP:", otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      otp // Remove this later in production
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const createAdmin = async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      password,
      phone
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const admin =
      await User.create({

        firstName,
        lastName,
        email,
        password:
          hashedPassword,
        phone,

        role: "admin",

        isVerified: true

      });

    res.status(201).json({
      success: true,
      message:
        "Admin created successfully",
      admin
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
};
