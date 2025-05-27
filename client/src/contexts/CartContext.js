import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.warn('useCart must be used within a CartProvider');
    return {
      cartItems: [],
      cartTotal: 0,
      cartCount: 0,
      isOpen: false,
      setIsOpen: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {}
    };
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on init
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('smartpick_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('smartpick_cart');
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('smartpick_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product data');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    if (!productId) return;
    
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!productId || newQuantity < 0) return;
    
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart...'); // Debug log
    setCartItems([]);
    try {
      localStorage.removeItem('smartpick_cart');
      console.log('Cart cleared from localStorage'); // Debug log
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  // Add missing isInCart function
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Calculate cart count
  const cartCount = Array.isArray(cartItems) ? cartItems.reduce((count, item) => count + item.quantity, 0) : 0;

  const value = {
    cartItems: cartItems || [],
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart // Add this function to the context value
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
