// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');

// Middleware to protect routes requiring user authentication
exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to protect admin routes
exports.authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Admin authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is for a user with admin privileges
    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      req.user = user;
      next();
    } 
    // Check if token is for an admin
    else if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      req.admin = admin;
      next();
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};