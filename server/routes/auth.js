// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');
const { authenticateUser } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to auth routes
router.use('/register', rateLimiter(3, 15 * 60 * 1000)); // 3 requests per 15 minutes
router.use('/login', rateLimiter(5, 15 * 60 * 1000)); // 5 requests per 15 minutes
router.use('/admin/login', rateLimiter(3, 15 * 60 * 1000)); // 3 requests per 15 minutes

// User Registration
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with that email or username' 
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password, // Will be hashed via pre-save hook
      firstName,
      lastName,
      phone
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Return user data (excluding password) and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Return user data and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Login
router.post('/admin/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // First try to find an admin
    let admin = await Admin.findOne({ email });
    
    // If admin not found, check for user with admin privileges
    if (!admin) {
      const user = await User.findOne({ email, isAdmin: true });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token for user with admin privileges
      const token = jwt.sign(
        { id: user._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    }
    
    // Verify admin password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time
    admin.lastLogin = Date.now();
    await admin.save();
    
    // Generate JWT token for admin
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return admin data and token
    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user profile
router.get('/me', authenticateUser, async (req, res) => {
  try {
    // req.user is already populated from the authenticateUser middleware
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        addresses: req.user.addresses,
        wishlist: req.user.wishlist,
        isAdmin: req.user.isAdmin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/me', authenticateUser, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    // Find and update user
    const user = req.user;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add address to user profile
router.post('/address', authenticateUser, async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    
    const user = req.user;
    
    // If this address is set as default, unset any existing default
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Add new address
    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      isDefault: isDefault || user.addresses.length === 0 // Make default if it's the first address
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/password', authenticateUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }
    
    // Get user with password (we need this for comparison)
    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;