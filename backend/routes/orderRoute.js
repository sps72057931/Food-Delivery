import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  placeOrder,
  userOrders,
  listOrders,
  updateStatus,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// place online order
orderRouter.post("/place", authMiddleware, placeOrder);

// ✅ place COD order (required for your frontend)
orderRouter.post("/place-cod", authMiddleware, placeOrder);

// get user's orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// admin: get all orders
orderRouter.get("/list", authMiddleware, listOrders);

// admin: update order status
orderRouter.post("/status", authMiddleware, updateStatus);

// user: cancel order
orderRouter.post("/cancel", authMiddleware, cancelOrder);

// user: delete order permanently
orderRouter.delete("/delete/:id", authMiddleware, deleteOrder);

export default orderRouter;
