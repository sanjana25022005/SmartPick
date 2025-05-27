import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    // Return safe defaults instead of throwing error
    return {
      wishlistItems: [],
      wishlistCount: 0,
      addToWishlist: () => console.warn('WishlistProvider not found'),
      removeFromWishlist: () => console.warn('WishlistProvider not found'),
      isInWishlist: () => false,
      clearWishlist: () => console.warn('WishlistProvider not found')
    };
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on init
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('smartpick_wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlistItems(parsedWishlist);
        }
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      localStorage.removeItem('smartpick_wishlist');
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('smartpick_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    if (!product || !product.id) {
      console.error('Invalid product data');
      return;
    }

    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => item.id === product.id);
      if (exists) {
        return prevItems; // Already in wishlist
      }
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const isInWishlist = (productId) => {
    if (!productId || !Array.isArray(wishlistItems)) return false;
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    try {
      localStorage.removeItem('smartpick_wishlist');
    } catch (error) {
      console.error('Error clearing wishlist from localStorage:', error);
    }
  };

  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const value = {
    wishlistItems: wishlistItems || [],
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
