const mongoose = require('mongoose');
const { Admin } = require('../models');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@smartpick.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    // Create default admin
    const admin = new Admin({
      email: 'admin@smartpick.com',
      password: 'Admin@123456', // Will be hashed by pre-save hook
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superadmin'
    });
    
    await admin.save();
    console.log('Default admin created successfully!');
    console.log('Email: admin@smartpick.com');
    console.log('Password: Admin@123456');
    console.log('Please change the password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
