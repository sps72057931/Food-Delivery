import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delivery-api-jq2l.onrender.com";

  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [showLogin, setShowLogin] = useState(false); // ⭐ Add this

  const addToCart = async (itemId) => {
    // ⭐ Check if user is logged in first
    if (!token) {
      toast.error("Please login first");
      setShowLogin(true); // Trigger login popup
      return;
    }

    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    const response = await axios.post(
      url + "/api/cart/add",
      { itemId },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success("Item added to cart");
    } else {
      toast.error("Something went wrong");
    }
  };

  const removeFromCart = async (itemId) => {
    // ⭐ Check if user is logged in first
    if (!token) {
      toast.error("Please login first");
      setShowLogin(true);
      return;
    }

    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    const response = await axios.post(
      url + "/api/cart/remove",
      { itemId },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error("Something went wrong");
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    if (response.data.success) {
      setFoodList(response.data.data);
    } else {
      alert("Error! Products are not fetching..");
    }
  };

  const loadCardData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    showLogin, // ⭐ Add this
    setShowLogin, // ⭐ Add this
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
