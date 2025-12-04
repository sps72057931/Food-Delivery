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

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];

    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod: paymentMethod,
    };

    // COD ORDER
    if (paymentMethod === "cod") {
      let response = await axios.post(url + "/api/order/place-cod", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("Order placed successfully");
        navigate("/myorders");
      } else {
        toast.error("Failed to place COD order");
      }

      return;
    }

    // STRIPE ORDER
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });

    if (response.data.success) {
      window.location.replace(response.data.session_url);
    } else {
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please Login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Please Add Items to Cart");
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
          type="text"
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
          placeholder="Phone"
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
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          {/* PAYMENT OPTIONS */}
          <div className="payment-method">
            <h3>Payment Method</h3>

            {/* COD */}
            <div
              className={`payment-option ${
                paymentMethod === "cod" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div
                className={`radio-circle ${
                  paymentMethod === "cod" ? "active" : ""
                }`}
              >
                {paymentMethod === "cod" && (
                  <div className="radio-inner-dot"></div>
                )}
              </div>
              <span>COD ( Cash on delivery )</span>
            </div>

            {/* STRIPE */}
            <div
              className={`payment-option ${
                paymentMethod === "stripe" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("stripe")}
            >
              <div
                className={`radio-circle ${
                  paymentMethod === "stripe" ? "active" : ""
                }`}
              >
                {paymentMethod === "stripe" && (
                  <div className="radio-inner-dot"></div>
                )}
              </div>
              <span>Stripe ( Credit / Debit )</span>
            </div>
          </div>
          {/* PAYMENT OPTIONS */}
          <div className="payment-method">
            <h3>Payment Method</h3>

            {/* COD */}
            <div
              className={`payment-option ${
                paymentMethod === "cod" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div
                className={`radio-circle ${
                  paymentMethod === "cod" ? "active" : ""
                }`}
              >
                {paymentMethod === "cod" && (
                  <div className="radio-inner-dot"></div>
                )}
              </div>
              <span>COD ( Cash on delivery )</span>
            </div>

            {/* STRIPE */}
            <div
              className={`payment-option ${
                paymentMethod === "stripe" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("stripe")}
            >
              <div
                className={`radio-circle ${
                  paymentMethod === "stripe" ? "active" : ""
                }`}
              >
                {paymentMethod === "stripe" && (
                  <div className="radio-inner-dot"></div>
                )}
              </div>
              <span>Stripe ( Credit / Debit )</span>
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
