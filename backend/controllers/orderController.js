import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// -------------------- PLACE ORDER --------------------
export const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      // payment stays default: false
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("PLACE ORDER ERROR:", error);
    res.json({ success: false, message: "Error creating order" });
  }
};

// -------------------- USER ORDERS --------------------
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .sort({ date: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("USER ORDER ERROR:", error);
    res.json({ success: false });
  }
};

// -------------------- ALL ORDERS (ADMIN) --------------------
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("LIST ORDER ERROR:", error);
    res.json({ success: false });
  }
};

// -------------------- UPDATE STATUS (ADMIN) --------------------
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log("STATUS UPDATE ERROR:", error);
    res.json({ success: false });
  }
};
