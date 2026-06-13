const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const foodRoutes = require("./routes/foodRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/foods", foodRoutes);

app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Savora API"
  });
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});