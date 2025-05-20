// routes/wishlist.js
const express = require('express');
const { User, Product } = require('../models');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user wishlist
router.get('/', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist');
    
    res.json({
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add product to wishlist
router.post('/:productId', authenticateUser, async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    
    res.status(201).json({
      message: 'Product added to wishlist',
      productId
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove product from wishlist
router.delete('/:productId', authenticateUser, async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);
    
    // Filter out the product
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );
    
    await user.save();
    
    res.json({
      message: 'Product removed from wishlist',
      productId
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear wishlist
router.delete('/', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.wishlist = [];
    await user.save();
    
    res.json({
      message: 'Wishlist cleared'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;