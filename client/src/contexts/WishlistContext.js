import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('smartpick_wishlist');
      console.log('Loading wishlist from localStorage:', savedWishlist); // Debug log
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        setWishlistItems(parsed);
        console.log('Wishlist loaded:', parsed); // Debug log
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      setWishlistItems([]);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('Saving wishlist to localStorage:', wishlistItems); // Debug log
      localStorage.setItem('smartpick_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    console.log('Adding to wishlist:', product); // Debug log
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        console.log('Product already in wishlist'); // Debug log
        return prev; // Don't add if already exists
      }
      const newWishlist = [...prev, product];
      console.log('New wishlist after adding:', newWishlist); // Debug log
      return newWishlist;
    });
  };

  const removeFromWishlist = (productId) => {
    console.log('Removing from wishlist:', productId); // Debug log
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => item.id !== productId);
      console.log('New wishlist after removing:', newWishlist); // Debug log
      return newWishlist;
    });
  };

  const isInWishlist = (productId) => {
    const inWishlist = wishlistItems.some(item => item.id === productId);
    console.log(`Product ${productId} in wishlist:`, inWishlist); // Debug log
    return inWishlist;
  };

  const toggleWishlist = (product) => {
    console.log('Toggling wishlist for:', product); // Debug log
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    console.log('Clearing wishlist'); // Debug log
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
