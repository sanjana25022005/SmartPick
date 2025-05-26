const express = require('express');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Mock data for now
    const categories = [
      { id: 1, name: 'Pens & Writing', slug: 'pens' },
      { id: 2, name: 'Notebooks & Paper', slug: 'notebooks' },
      { id: 3, name: 'Desk Organizers', slug: 'organizers' },
      { id: 4, name: 'Art & Craft', slug: 'art' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

module.exports = router;
