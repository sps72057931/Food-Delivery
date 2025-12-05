import express from "express";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
  placeOrderCOD,
  cancelOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Stripe payment
orderRouter.post("/place", authMiddleware, placeOrder);

// COD order
orderRouter.post("/place-cod", authMiddleware, placeOrderCOD);

// Stripe verification
orderRouter.post("/verify", verifyOrder);

// User orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// ⭐ ADD THIS — CANCEL ORDER ROUTE
orderRouter.post("/cancel", authMiddleware, cancelOrder);

// Admin routes
orderRouter.post("/status", authMiddleware, updateStatus);
orderRouter.get("/list", authMiddleware, listOrders);

export default orderRouter;
