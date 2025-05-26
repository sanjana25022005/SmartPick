// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer')) {
      token = req.header('Authorization').replace('Bearer ', '');
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'User account is not active'
        });
      }

      req.user = decoded;
      req.userDoc = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Admin middleware
const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.userDoc && req.userDoc.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin rights required.'
      });
    }
  });
};

module.exports = { auth, adminAuth };