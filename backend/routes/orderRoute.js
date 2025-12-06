import express from "express";
import { cancelOrder } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
  placeOrderCOD,
  cancelOrder, // ⭐ Added import
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Stripe payment
orderRouter.post("/place", authMiddleware, placeOrder);

// COD order
orderRouter.post("/place-cod", authMiddleware, placeOrderCOD);

// Stripe verification
orderRouter.post("/verify", verifyOrder);

// Cancel order (⭐ NEW)
orderRouter.post("/cancel", authMiddleware, cancelOrder);

// Admin routes
orderRouter.post("/status", authMiddleware, updateStatus);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", authMiddleware, listOrders);
orderRouter.post("/cancel", authMiddleware, cancelOrder);

export default orderRouter;
