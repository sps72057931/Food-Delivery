// MyOrders Component - Replace Track Order with Cancel Order

import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets"; // ⭐ ADD THIS
import "./MyOrders.css";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Cancel Order Function
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      const response = await axios.post(
        url + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        alert("Order cancelled successfully!");
        fetchOrders(); // Refresh the orders list
      } else {
        alert(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order. Please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders.map((order, index) => {
          /* ⭐ CHANGED data to orders */
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />

              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " X " + item.quantity;
                  } else {
                    return item.name + " X " + item.quantity + ", ";
                  }
                })}
              </p>

              <p>₹{order.amount}</p>

              <p>Items: {order.items.length}</p>

              <p>
                <span>&#x25cf;</span>
                <b> {order.status}</b>
              </p>

              <button
                onClick={() => cancelOrder(order._id)}
                disabled={
                  order.status === "Cancelled" || order.status === "Delivered"
                }
                className={
                  order.status === "Cancelled" || order.status === "Delivered"
                    ? "disabled"
                    : ""
                }
              >
                {order.status === "Cancelled" ? "Cancelled" : "Cancel Order"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
