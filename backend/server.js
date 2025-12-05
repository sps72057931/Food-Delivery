import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// BASIC CORS (Allow all because all services are on Render)
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ROOT ROUTE → Redirect to Frontend
app.get("/", (req, res) => {
  res.redirect("https://food-delivery-frontend-njue.onrender.com");
});

// SERVER START
app.listen(port, () => console.log(`Server started on port ${port}`));
