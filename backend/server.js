import "dotenv/config"; // MUST be first

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();

// Render provides PORT automatically
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());

// IMPORTANT → allow frontend & Render to access backend
app.use(
  cors({
    origin: process.env.ADMIN_URL,
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Server start
app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
