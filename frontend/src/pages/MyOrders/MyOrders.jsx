// MyOrders Component - Replace Track Order with Cancel Order

import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './MyOrders.css';

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

  // Cancel order function
  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );
      
      if (response.data.success) {
        alert("Order cancelled successfully!");
        fetchOrders(); // Refresh orders list
      } else {
        alert("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order");
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
      <div className="orders-container">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src="/path/to/food-icon.png" alt="" />
            <p>{order.items.map((item, idx) => {
              if (idx === order.items.length - 1) {
                return item.name + " X " + item.quantity;
              } else {
                return item.name + " X " + item.quantity + ", ";
              }
            })}</p>
            <p>₹{order.amount}</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span className="status-dot">●</span>
              <b>{order.status}</b>
            </p>
            <button 
              onClick={() => cancelOrder(order._id)}
              disabled={order.status === "Cancelled" || order.status === "Delivered"}
              className={order.status === "Cancelled" || order.status === "Delivered" ? "disabled" : ""}
            >
              Cancel Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
