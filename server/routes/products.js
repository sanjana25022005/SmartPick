// routes/products.js
const express = require('express');
const { Product } = require('../models');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { brand, type, minPrice, maxPrice, rating, sort, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (brand) query.brand = brand;
    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query['ratings.average'] = { $gte: Number(rating) };
    
    // Sorting
    let sortOption = {};
    if (sort === 'priceAsc') sortOption.price = 1;
    else if (sort === 'priceDesc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'popularity') sortOption['ratings.count'] = -1;
    else sortOption = { createdAt: -1 }; // Default sort
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    
    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      totalProducts
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search products (public)
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    
    const products = await Product.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);
    
    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN ROUTES: These require admin authentication

// Create new product (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, price, type, brand, description, specifications, stock, images } = req.body;
    
    const product = new Product({
      name,
      price,
      type,
      brand,
      description,
      stock,
      images: images || []
    });
    
    // Add specifications if provided
    if (specifications) {
      product.specifications = new Map(Object.entries(specifications));
    }
    
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, price, type, brand, description, specifications, stock, images, discount, featured } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update fields
    if (name) product.name = name;
    if (price) product.price = price;
    if (type) product.type = type;
    if (brand) product.brand = brand;
    if (description) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (images) product.images = images;
    if (discount !== undefined) product.discount = discount;
    if (featured !== undefined) product.featured = featured;
    
    // Update specifications if provided
    if (specifications) {
      product.specifications = new Map(Object.entries(specifications));
    }
    
    product.updatedAt = Date.now();
    
    await product.save();
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add review to product (authenticated users only)
router.post('/:id/reviews', authenticateUser, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const alreadyReviewed = product.ratings.reviews.find(
      review => review.userId.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    // Add review
    const review = {
      userId: req.user._id,
      rating: Number(rating),
      comment,
      date: Date.now()
    };
    
    product.ratings.reviews.push(review);
    
    // Update average rating
    const totalRatings = product.ratings.reviews.reduce((acc, item) => acc + item.rating, 0);
    product.ratings.average = totalRatings / product.ratings.reviews.length;
    product.ratings.count = product.ratings.reviews.length;
    
    await product.save();
    
    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;