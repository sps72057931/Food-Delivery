import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ---------------------- PLACE ORDER ----------------------
export const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      status: "Placed",
      payment: false,
    });

    await newOrder.save();

    // clear user's cart after order
    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData: {},
    });

    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// ---------------------- GET USER ORDERS ----------------------
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// ---------------------- ADMIN: GET ALL ORDERS ----------------------
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// ---------------------- UPDATE ORDER STATUS ----------------------
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.json({ success: false, message: "Error updating status" });
  }
};

// ---------------------- CANCEL ORDER (USER) ----------------------
export const cancelOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: "Cancelled",
    });

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.json({ success: false, message: "Error cancelling order" });
  }
};

// ---------------------- DELETE ORDER PERMANENTLY ----------------------
export const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findOne({
      _id: req.params.id,
      userId: req.body.userId,
    });

    if (!order) return res.json({ success: false, message: "Order not found" });

    await orderModel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted permanently",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting order" });
  }
};
