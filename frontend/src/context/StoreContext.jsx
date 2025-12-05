import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Backend URL
  const url = "https://food-delivery-api-jq2l.onrender.com";

  // Create Authorization header
  const authHeader = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // -----------------------------
  // Add to Cart
  // -----------------------------
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        authHeader(token)
      );

      if (response.data.success) {
        toast.success("Item added to cart");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // -----------------------------
  // Remove from Cart
  // -----------------------------
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));

    if (token) {
      const response = await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        authHeader(token)
      );

      if (response.data.success) {
        toast.success("Item removed from cart");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // -----------------------------
  // Cart Total Amount
  // -----------------------------
  const getTotalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const foodItem = food_list.find((p) => p._id === item);
        if (foodItem) {
          total += foodItem.price * cartItems[item];
        }
      }
    }

    return total;
  };

  // -----------------------------
  // Fetch food list
  // -----------------------------
  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setFoodList(response.data.data);
    } else {
      toast.error("Error fetching products");
    }
  };

  // -----------------------------
  // Load user's cart
  // -----------------------------
  const loadCartData = async (token) => {
    const response = await axios.post(
      `${url}/api/cart/get`,
      {},
      authHeader(token)
    );

    setCartItems(response.data.cartData || {});
  };

  // -----------------------------
  // Initial Load
  // -----------------------------
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
