import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================
// PLACE ORDER (STRIPE)
// ==========================
const placeOrder = async (req, res) => {
  const frontend_url = "https://food-delivery-frontend-njue.onrender.com";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Food Processing",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Stripe payment failed" });
  }
};

// ==========================
// PLACE ORDER (COD)
// ==========================
const placeOrderCOD = async (req, res) => {
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
// VERIFY ORDER (STRIPE)
// ==========================
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment cancelled" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Verification failed" });
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
// CANCEL ORDER (PERMANENT DELETE)
// ==========================
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.body.userId;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    // Only owner can cancel
    if (order.userId.toString() !== userId)
      return res.json({ success: false, message: "Unauthorized request" });

    // If Stripe & paid -> cannot cancel
    if (order.paymentMethod === "Stripe" && order.payment === true)
      return res.json({
        success: false,
        message: "Paid Stripe orders cannot be cancelled",
      });

    // FINAL: DELETE ORDER PERMANENTLY
    await orderModel.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: "Order permanently deleted",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error cancelling order" });
  }
};

export {
  placeOrder,
  placeOrderCOD,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  cancelOrder,
};
