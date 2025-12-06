import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  cancelOrder,
  deleteOrder,
  removeOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place COD order
orderRouter.post("/place", authMiddleware, placeOrder);

// Cancel order
orderRouter.post("/cancel", authMiddleware, cancelOrder);

// Delete order
orderRouter.post("/delete", authMiddleware, deleteOrder);

// User orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// Admin: List all orders
orderRouter.get("/list", authMiddleware, listOrders);

// Admin: Update order status
orderRouter.post("/status", authMiddleware, updateStatus);

orderRouter.post("/remove", authMiddleware, removeOrder); // Add this new route

export default orderRouter;
