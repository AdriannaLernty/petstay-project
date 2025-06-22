import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [userKey, setUserKey] = useState("guest_cart");

  // Get the user only once (on load)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserKey(`cart_${user.name}`);
    } else {
      setUserKey("guest_cart");
    }
  }, []); // ✅ Only run once when app starts

  // Load cart when userKey changes
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(userKey)) || [];
    setCart(storedCart);
  }, [userKey]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(cart));
  }, [cart, userKey]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
