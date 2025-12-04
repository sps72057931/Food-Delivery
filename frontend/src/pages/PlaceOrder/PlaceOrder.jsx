import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [paymentMethod, setPaymentMethod] = useState("stripe");

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

  // Handle input change
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Place Order Function
  const placeOrder = async (event) => {
    event.preventDefault();

    // Build order items (ONLY required fields)
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
        image: item.image,
      }));

    if (orderItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod,
    };

    // ===========================
    // ⭐ CASH ON DELIVERY (COD)
    // ===========================
    if (paymentMethod === "cod") {
      try {
        const response = await axios.post(
          `${url}/api/order/place-cod`,
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Order placed successfully!");
          navigate("/myorders");
        } else {
          toast.error(response.data.message || "COD order failed");
        }
      } catch (error) {
        toast.error("COD order failed (server error)");
      }

      return;
    }

    // ===========================
    // ⭐ STRIPE PAYMENT
    // ===========================
    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error("Stripe payment failed");
      }
    } catch (error) {
      toast.error("Stripe payment error");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Please add items to cart");
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last Name"
          />
        </div>

        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email Address"
        />

        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
        />

        <div className="multi-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>

        <div className="multi-fields">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>

        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone Number"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() + 2}</b>
            </div>
          </div>

          {/* PAYMENT OPTIONS */}
          <div className="payment-method">
            <h3>Select Payment Method</h3>

            <div
              className={`payment-option ${
                paymentMethod === "cod" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="radio-circle">
                {paymentMethod === "cod" && <span className="dot"></span>}
              </span>
              Cash On Delivery (COD)
            </div>

            <div
              className={`payment-option ${
                paymentMethod === "stripe" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("stripe")}
            >
              <span className="radio-circle">
                {paymentMethod === "stripe" && <span className="dot"></span>}
              </span>
              Stripe (Card Payment)
            </div>
          </div>

          <button type="submit">
            {paymentMethod === "cod" ? "PLACE ORDER" : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
