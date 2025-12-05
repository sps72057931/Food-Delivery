import express from "express";
import {
  placeOrder,
  userOrders,
  listOrders,
  updateStatus,
  cancelOrder, // ← REQUIRED
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.post("/cancel", cancelOrder);

export default orderRouter;
