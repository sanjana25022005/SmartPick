// routes/orders.js
const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', adminAuth, async (req, res) => {
  try {
    // Mock data for now - will implement with Order model later
    const orders = [
      {
        id: 'ORD-2024-001',
        customer: { name: 'John Doe', email: 'john@example.com' },
        total: 1299,
        status: 'pending',
        date: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get user's orders
// @access  Private
router.get('/my-orders', auth, async (req, res) => {
  try {
    // Mock data for now
    const orders = [];

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

module.exports = router;