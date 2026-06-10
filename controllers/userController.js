const bcrypt = require("bcryptjs");

const User = require("../models/user");
const OTP = require("../models/otp");

const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone
    } = req.body;

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

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

    await sendEmail(
      email,
      "Savora Email Verification",
      `Your OTP is ${otp}`
    );

    res.status(201).json({
      success: true,
      message:
        "User registered. OTP sent to email."
    });

  } catch (error) {
    res.status(500).json({
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

const getProfile = async (
  req,
  res
) => {

  res.json({
    success: true,
    user: req.user
  });

};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  getProfile
};
