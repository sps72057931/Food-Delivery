import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
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
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Cancel order function - no alerts
  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        fetchOrders(); // Just refresh silently
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  // Delete order function - instant UI update
  const deleteOrder = async (orderId) => {
    // Remove from UI immediately for better UX
    setOrders(orders.filter((order) => order._id !== orderId));

    try {
      const response = await axios.post(
        url + "/api/order/delete",
        { orderId },
        { headers: { token } }
      );

      if (!response.data.success) {
        // If deletion failed, refresh to get accurate data
        fetchOrders();
        alert(response.data.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      // Refresh on error to show accurate state
      fetchOrders();
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

              <div className="order-actions">
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

                {order.status === "Cancelled" && (
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="delete-btn"
                    title="Delete order from history"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
