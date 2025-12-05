import orderModel from "../models/orderModel.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
    });

    await newOrder.save();
    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET USER ORDERS
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN – GET ALL ORDERS
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN – UPDATE STATUS
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ❗ FIX: ADD CANCEL ORDER (JO ROUTER MAANG RAHA THA)
export const cancelOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: "Order Cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
