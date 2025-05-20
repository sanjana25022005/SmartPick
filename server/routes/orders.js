// routes/orders.js
const express = require('express');
const { Order, Product } = require('../models');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get logged in user's orders
router.get('/myorders', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price');
    
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Ensure user is authorized to view this order
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new order
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { items, shippingAddress, paymentInfo } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Fetch product details and calculate total
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      
      if (item.quantity > product.stock) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      // Calculate price with any discounts
      const priceAfterDiscount = product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
      
      // Add to order items
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: priceAfterDiscount
      });
      
      // Update total
      totalAmount += priceAfterDiscount * item.quantity;
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentInfo
    });
    
    const createdOrder = await order.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      order: createdOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order to paid
router.put('/:id/pay', authenticateUser, async (req, res) => {
  try {
    const { paymentResult } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Ensure user is authorized
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update payment info
    order.paymentInfo = {
      id: paymentResult.id,
      status: 'Completed',
      method: paymentResult.method
    };
    
    // Update order status
    order.status = 'Processing';
    order.updatedAt = Date.now();
    
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Order marked as paid',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN ROUTES

// Get all orders (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'email username')
      .populate('items.product', 'name');
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    
    res.json({
      orders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / Number(limit)),
      totalOrders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update status
    order.status = status;
    order.updatedAt = Date.now();
    
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Order status updated',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a one-click reorder endpoint
router.post('/:id/reorder', authenticateUser, async (req, res) => {
  try {
    // Find the original order
    const originalOrder = await Order.findById(req.params.id)
      .populate('items.product');
    
    if (!originalOrder) {
      return res.status(404).json({ message: 'Original order not found' });
    }
    
    // Ensure user is authorized
    if (originalOrder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reorder this order' });
    }
    
    // Fetch product details and calculate total
    const orderItems = [];
    let totalAmount = 0;
    let unavailableItems = [];
    
    for (const item of originalOrder.items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        unavailableItems.push(`Product no longer available: ${item.product.name || item.product}`);
        continue;
      }
      
      if (item.quantity > product.stock) {
        unavailableItems.push(`Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        continue;
      }
      
      // Calculate price with any discounts
      const priceAfterDiscount = product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
      
      // Add to order items
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: priceAfterDiscount
      });
      
      // Update total
      totalAmount += priceAfterDiscount * item.quantity;
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    if (orderItems.length === 0) {
      return res.status(400).json({ 
        message: 'Cannot reorder - all items are unavailable',
        unavailableItems
      });
    }
    
    // Create new order using original shipping address
    const newOrder = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: originalOrder.shippingAddress,
      paymentInfo: {
        method: originalOrder.paymentInfo?.method || 'Pending'
      }
    });
    
    const createdOrder = await newOrder.save();
    
    res.status(201).json({
      message: 'Order resubmitted successfully',
      order: createdOrder,
      unavailableItems: unavailableItems.length > 0 ? unavailableItems : undefined
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;