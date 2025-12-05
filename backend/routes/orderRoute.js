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

// place order
orderRouter.post("/place", authMiddleware, placeOrder);

// get user's orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// admin all orders
orderRouter.get("/list", authMiddleware, listOrders);

// admin update status
orderRouter.post("/status", authMiddleware, updateStatus);

// user cancel order
orderRouter.post("/cancel", authMiddleware, cancelOrder);

// user delete permanently
orderRouter.delete("/delete/:id", authMiddleware, deleteOrder);

export default orderRouter;
