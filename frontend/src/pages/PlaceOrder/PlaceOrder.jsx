import React, { useState, useContext } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = ({ url }) => {
  const { cartItems, getTotalCartAmount, token, food_list } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateData = () => {
    for (let key in data) {
      if (!data[key]) {
        toast.error(`Please fill ${key}`);
        return false;
      }
    }
    return true;
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!validateData()) return;

    if (!token) {
      toast.error("Please login to place order");
      return;
    }

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    let orderData = {
      userId: localStorage.getItem("userId"),
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      address: data,
    };

    // -------------------------
    // COD ORDER
    // -------------------------
    if (paymentMethod === "cod") {
      orderData.paymentMethod = "cod";

      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success && response.data.cod) {
        toast.success("Order placed successfully (COD)");
        navigate("/myorders");
      } else {
        toast.error("Failed to place COD order");
      }

      return;
    }

    // -------------------------
    // STRIPE ORDER
    // -------------------------
    orderData.paymentMethod = "stripe";

    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });

    if (response.data.success && response.data.session_url) {
      window.location.replace(response.data.session_url);
    } else {
      toast.error("Payment failed");
    }
  };

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <h1>Delivery information</h1>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      {/* Payment Section */}
      <div className="place-order-right">
        <h2>Payment Method</h2>

        <div className="payment-options">
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            <span>Credit / Debit Card (Stripe)</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <span>Cash on Delivery (COD)</span>
          </label>
        </div>

        <button type="submit" className="place-order-submit">
          Place Order
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
