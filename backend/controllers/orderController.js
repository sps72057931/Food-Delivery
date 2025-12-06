import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ==========================
// PLACE ORDER (COD ONLY)
// ==========================
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: "COD",
      payment: false,
      status: "Food Processing",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "COD Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "COD Order Failed" });
  }
};

// ==========================
// USER ORDERS
// ==========================
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// ==========================
// CANCEL ORDER
// ==========================
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== req.body.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (order.status === "Delivered") {
      return res.json({
        success: false,
        message: "Cannot cancel delivered orders",
      });
    }

    if (order.status === "Cancelled") {
      return res.json({ success: false, message: "Order already cancelled" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error cancelling order" });
  }
};

// ==========================
// ADMIN: LIST ALL ORDERS
// ==========================
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ==========================
// ADMIN: UPDATE ORDER STATUS
// ==========================
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
};

// ==========================
// DELETE ORDER
// ==========================
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== req.body.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // ✅ Allow deletion of BOTH Cancelled AND Delivered orders
    if (order.status !== "Cancelled" && order.status !== "Delivered") {
      return res.json({
        success: false,
        message: "Only cancelled or delivered orders can be deleted",
      });
    }

    await orderModel.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting order" });
  }
};

export {
  placeOrder,
  userOrders,
  cancelOrder,
  deleteOrder,
  listOrders,
  updateStatus,
};
