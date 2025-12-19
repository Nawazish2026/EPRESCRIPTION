import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (medicine) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item._id === medicine._id);
      if (itemExists) {
        return prevItems.map((item) =>
          item._id === medicine._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (medicineId, quantity) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item._id !== medicineId);
      }
      return prevItems.map((item) =>
        item._id === medicineId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (medicineId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== medicineId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);