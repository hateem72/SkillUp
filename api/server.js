import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import feedbackRoute from "./routes/feedback.route.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/feedback", feedbackRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({ message: errorMessage });
});

// Start server
app.listen(5000, () => {
  connect();
  console.log("Backend server is running on port 5000!");
});