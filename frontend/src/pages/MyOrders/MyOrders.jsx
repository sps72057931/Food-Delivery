import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token: token } }
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Delete order permanently
  const deleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(
        `${url}/api/order/delete/${orderId}`,
        { headers: { token: token } }
      );

      if (response.data.success) {
        toast.success("Order Deleted");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
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
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>

            <p>₹{order.amount}</p>
            <p>Items: {order.items.length}</p>

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

            {order.status === "Cancelled" && (
              <div
                className="delete-icon"
                onClick={() => deleteOrder(order._id)}
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
