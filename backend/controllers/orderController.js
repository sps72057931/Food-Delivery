import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items, // this now contains name, price, qty
      amount: req.body.amount,
      address: req.body.address,
      status: "Placed",
      payment: false,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData: {},
    });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error placing order" });
  }
};

// USER ORDERS
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch {
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// ADMIN ALL ORDERS
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch {
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// UPDATE STATUS
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.json({ success: true, message: "Order status updated" });
  } catch {
    res.json({ success: false, message: "Error updating status" });
  }
};

// CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: "Cancelled",
    });

    res.json({ success: true, message: "Order cancelled" });
  } catch {
    res.json({ success: false, message: "Error cancelling order" });
  }
};

// DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    const userId = req.query.userId;

    const order = await orderModel.findOne({
      _id: req.params.id,
      userId,
    });

    if (!order) return res.json({ success: false, message: "Order not found" });

    await orderModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Order deleted permanently" });
  } catch (error) {
    res.json({ success: false, message: "Error deleting order" });
  }
};
