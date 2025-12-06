import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
  placeOrderCOD,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Stripe payment
orderRouter.post("/place", authMiddleware, placeOrder);

// COD order
orderRouter.post("/place-cod", authMiddleware, placeOrderCOD);

// Stripe verification
orderRouter.post("/verify", verifyOrder);

// Cancel order
orderRouter.post("/cancel", authMiddleware, cancelOrder);

// Delete order (⭐ ADD THIS)
orderRouter.post("/delete", authMiddleware, deleteOrder);

// Admin routes
orderRouter.post("/status", authMiddleware, updateStatus);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", authMiddleware, listOrders);

export default orderRouter;
