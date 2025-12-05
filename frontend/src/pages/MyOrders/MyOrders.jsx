import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Cancel (backend permanent delete)
  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        url + `/api/order/cancel/${orderId}`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order Cancelled");
        fetchOrders(); // Refresh list
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  // Remove cancelled order from UI
  const removeFromUI = (orderId) => {
    setData((prev) => prev.filter((order) => order._id !== orderId));
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {data.map((order) => (
          <div
            key={order._id}
            className={`my-orders-order ${
              order.status === "Cancelled" ? "cancelled" : ""
            }`}
          >
            <img src={assets.parcel_icon} alt="" />

            <p>
              {order.items.map((item, idx) =>
                idx === order.items.length - 1
                  ? item.name + " x " + item.quantity
                  : item.name + " x " + item.quantity + ", "
              )}
            </p>

            <p>₹{order.amount}</p>
            <p>Items: {order.items.length}</p>

            {/* STATUS TEXT */}
            <p>
              <span
                style={{
                  color: order.status === "Cancelled" ? "red" : "#4caf50",
                }}
              >
                ●
              </span>
              <b
                style={{
                  color: order.status === "Cancelled" ? "red" : "black",
                  marginLeft: "8px",
                }}
              >
                {order.status}
              </b>
            </p>

            {/* Cancel Button */}
            {order.status !== "Cancelled" && (
              <button onClick={() => cancelOrder(order._id)}>
                Cancel Order
              </button>
            )}

            {/* Cross Delete Icon (Frontend Only) */}
            {order.status === "Cancelled" && (
              <div
                className="delete-icon"
                onClick={() => removeFromUI(order._id)}
              >
                ✖
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
