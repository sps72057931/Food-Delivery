import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const url = "https://food-delivery-api-jq2l.onrender.com";

  // ADD TO CART
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) toast.success("Item added to cart");
      else toast.error(response.data.message || "Something went wrong");
    }
  };

  // REMOVE FROM CART
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));

    if (token) {
      const response = await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) toast.success("Item removed");
      else toast.error(response.data.message || "Something went wrong");
    }
  };

  // TOTAL AMOUNT
  const getTotalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const foodItem = food_list.find((p) => p._id === item);
        if (foodItem) total += foodItem.price * cartItems[item];
      }
    }
    return total;
  };

  // FOOD LIST
  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) setFoodList(response.data.data);
    else toast.error("Error fetching foods");
  };

  // LOAD CART
  const loadCartData = async (token) => {
    const response = await axios.post(
      `${url}/api/cart/get`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCartItems(response.data.cartData || {});
  };

  // INITIAL LOAD
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    const loadData = async () => {
      await fetchFoodList();

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
