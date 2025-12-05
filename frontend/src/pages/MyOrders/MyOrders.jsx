import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order Cancelled");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  // 🔥 Dynamic Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Cancelled":
        return "red";
      case "Delivered":
        return "green";
      case "Out for Delivery":
        return "blue";
      case "Processing":
        return "orange";
      default:
        return "gray";
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
        {data.map((order, index) => (
          <div
            key={index}
            className={`my-orders-order ${
              order.status === "Cancelled" ? "cancelled" : ""
            }`}
          >
            <img src={assets.parcel_icon} alt="" />

            <p>
              {order.items.map((item, idx) =>
                idx === order.items.length - 1
                  ? item.name + " X " + item.quantity
                  : item.name + " X " + item.quantity + ", "
              )}
            </p>

            <p>₹{order.amount}</p>
            <p>Items: {order.items.length}</p>

            {/* STATUS UI */}
            <p>
              <span
                style={{
                  fontSize: "18px",
                  marginRight: "6px",
                  color: getStatusColor(order.status),
                }}
              >
                ●
              </span>

              <b style={{ color: getStatusColor(order.status) }}>
                {order.status}
              </b>
            </p>

            {/* Cancel Button */}
            {order.status !== "Cancelled" && order.status !== "Delivered" && (
              <button onClick={() => cancelOrder(order._id)}>
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
