const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting SmartPick Database Setup...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartpick';
    console.log('Connection URI:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Drop existing collections (for fresh setup)
    console.log('🧹 Cleaning existing collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`   Dropped: ${collection.name}`);
    }
    
    if (collections.length === 0) {
      console.log('   No existing collections found');
    }

    // Create collections with validation
    console.log('\n📋 Creating collections...');
    await createCollections();
    
    // Insert seed data
    console.log('\n🌱 Inserting seed data...');
    await insertSeedData();
    
    // Create indexes
    console.log('\n🔍 Creating database indexes...');
    await createIndexes();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Summary:');
    const finalCollections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of finalCollections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`   ${collection.name}: ${count} documents`);
    }
    
    console.log('\n✨ Ready to start your SmartPick application!');
    console.log('   Run: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB Connection Failed:');
      console.log('   1. Make sure MongoDB is running');
      console.log('   2. Start MongoDB: net start MongoDB');
      console.log('   3. Or manually: mongod --dbpath="C:\\data\\db"');
    }
    
    process.exit(1);
  }
};

const createCollections = async () => {
  // Users Collection
  await mongoose.connection.db.createCollection('users');
  console.log('   ✓ Users collection created');

  // Products Collection
  await mongoose.connection.db.createCollection('products');
  console.log('   ✓ Products collection created');

  // Orders Collection
  await mongoose.connection.db.createCollection('orders');
  console.log('   ✓ Orders collection created');

  // Categories Collection
  await mongoose.connection.db.createCollection('categories');
  console.log('   ✓ Categories collection created');

  // Reviews Collection
  await mongoose.connection.db.createCollection('reviews');
  console.log('   ✓ Reviews collection created');

  // Coupons Collection
  await mongoose.connection.db.createCollection('coupons');
  console.log('   ✓ Coupons collection created');
};

const insertSeedData = async () => {
  const { ObjectId } = mongoose.Types;

  // Seed Categories
  const categoryIds = {
    pens: new ObjectId(),
    notebooks: new ObjectId(),
    organizers: new ObjectId(),
    art: new ObjectId()
  };

  await mongoose.connection.db.collection('categories').insertMany([
    {
      _id: categoryIds.pens,
      name: 'Pens & Writing',
      slug: 'pens',
      description: 'High-quality pens and writing instruments',
      isActive: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: categoryIds.notebooks,
      name: 'Notebooks & Paper',
      slug: 'notebooks',
      description: 'Premium notebooks and paper products',
      isActive: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: categoryIds.organizers,
      name: 'Desk Organizers',
      slug: 'organizers',
      description: 'Keep your workspace organized',
      isActive: true,
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: categoryIds.art,
      name: 'Art & Craft',
      slug: 'art',
      description: 'Art supplies and craft materials',
      isActive: true,
      sortOrder: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  console.log('   ✓ Categories seeded');

  // Seed Users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('password', 12);

  const userIds = {
    admin: new ObjectId(),
    user: new ObjectId()
  };

  await mongoose.connection.db.collection('users').insertMany([
    {
      _id: userIds.admin,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@smartpick.com',
      password: adminPassword,
      phone: '+91 9876543210',
      isAdmin: true,
      isVerified: true,
      status: 'active',
      preferences: {
        newsletter: true,
        notifications: true,
        theme: 'light'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: userIds.user,
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@test.com',
      password: userPassword,
      phone: '+91 9876543211',
      isAdmin: false,
      isVerified: true,
      status: 'active',
      addresses: [{
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
        isDefault: true
      }],
      preferences: {
        newsletter: true,
        notifications: true,
        theme: 'light'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  console.log('   ✓ Users seeded (admin@smartpick.com & user@test.com)');

  // Seed Products
  const productIds = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];

  await mongoose.connection.db.collection('products').insertMany([
    {
      _id: productIds[0],
      name: 'Premium Gel Pen Set',
      description: 'High-quality gel pens with smooth writing experience. Perfect for students and professionals. Features quick-dry ink and comfortable grip.',
      price: 299,
      originalPrice: 399,
      brand: 'Pilot',
      category: 'pens',
      type: 'Gel Pens',
      stock: 50,
      sku: 'PEN-001',
      images: [
        'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586953270536-3a823b3a7699?w=400&h=400&fit=crop'
      ],
      features: ['Smooth writing', 'Quick-dry ink', 'Comfortable grip', 'Pack of 10', 'Refillable'],
      specifications: {
        'Ink Color': 'Blue, Black, Red',
        'Point Size': '0.7mm',
        'Material': 'Plastic',
        'Pack Size': '10 pens',
        'Refillable': 'Yes'
      },
      rating: { average: 4.5, count: 128 },
      status: 'active',
      tags: ['writing', 'office', 'school', 'gel-pen'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: productIds[1],
      name: 'A4 Ruled Notebooks Pack',
      description: 'Pack of 5 high-quality ruled notebooks with premium paper quality. Perfect for note-taking and journaling.',
      price: 450,
      originalPrice: 500,
      brand: 'Classmate',
      category: 'notebooks',
      type: 'Ruled Notebooks',
      stock: 30,
      sku: 'NB-001',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
      ],
      features: ['80 GSM paper', 'Spiral bound', 'Perforated pages', 'Pack of 5', 'Durable cover'],
      specifications: {
        'Paper Quality': '80 GSM',
        'Pages': '200 pages each',
        'Size': 'A4',
        'Ruling': '8mm ruled',
        'Binding': 'Spiral'
      },
      rating: { average: 4.3, count: 95 },
      status: 'active',
      tags: ['notebook', 'study', 'writing', 'ruled'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: productIds[2],
      name: 'Desk Organizer Pro',
      description: 'Multi-compartment desk organizer to keep your workspace tidy and organized. Features 8 different sized compartments.',
      price: 899,
      originalPrice: 1299,
      brand: 'OfficeMax',
      category: 'organizers',
      type: 'Desk Organizers',
      stock: 8,
      sku: 'ORG-001',
      images: [
        'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop'
      ],
      features: ['8 compartments', 'Durable plastic', 'Non-slip base', 'Easy to clean', 'Modern design'],
      specifications: {
        'Material': 'High-quality ABS plastic',
        'Dimensions': '25cm x 20cm x 15cm',
        'Compartments': '8 compartments',
        'Color': 'Black',
        'Weight': '800g'
      },
      rating: { average: 4.7, count: 67 },
      status: 'active',
      tags: ['organizer', 'office', 'desk', 'storage'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: productIds[3],
      name: 'Colored Pencil Art Set',
      description: 'Professional colored pencil set with 48 vibrant colors. Perfect for artists and art enthusiasts.',
      price: 1200,
      originalPrice: 1500,
      brand: 'Faber-Castell',
      category: 'art',
      type: 'Colored Pencils',
      stock: 15,
      sku: 'ART-001',
      images: [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop'
      ],
      features: ['48 colors', 'Professional grade', 'Break-resistant', 'Wooden case', 'Blendable'],
      specifications: {
        'Colors': '48 different colors',
        'Grade': 'Professional',
        'Material': 'Premium wood',
        'Case': 'Wooden storage case',
        'Lead Type': 'Wax-based'
      },
      rating: { average: 4.8, count: 234 },
      status: 'active',
      tags: ['art', 'drawing', 'colored-pencils', 'professional'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: productIds[4],
      name: 'Sticky Notes Mega Pack',
      description: 'Assorted sticky notes in different sizes and colors. Perfect for reminders and organization.',
      price: 199,
      originalPrice: 249,
      brand: 'Post-it',
      category: 'organizers',
      type: 'Sticky Notes',
      stock: 100,
      sku: 'STK-001',
      images: [
        'https://images.unsplash.com/photo-1586281380349-632531d7ed4e?w=400&h=400&fit=crop'
      ],
      features: ['Multiple colors', 'Different sizes', 'Strong adhesive', 'Easy removal', '500 notes total'],
      specifications: {
        'Colors': '5 different colors',
        'Sizes': '3 different sizes',
        'Quantity': '500 notes',
        'Material': 'Paper',
        'Adhesive': 'Repositionable'
      },
      rating: { average: 4.2, count: 89 },
      status: 'active',
      tags: ['sticky-notes', 'organization', 'office', 'colorful'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  console.log('   ✓ Products seeded (5 products)');

  // Seed Sample Orders
  await mongoose.connection.db.collection('orders').insertMany([
    {
      _id: new ObjectId(),
      orderNumber: 'ORD-2024-001',
      user: userIds.user,
      items: [
        {
          product: productIds[0],
          name: 'Premium Gel Pen Set',
          quantity: 2,
          price: 299,
          image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=400&h=400&fit=crop'
        },
        {
          product: productIds[1],
          name: 'A4 Ruled Notebooks Pack',
          quantity: 1,
          price: 450,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop'
        }
      ],
      subtotal: 1048,
      tax: 188.64,
      shipping: 50,
      discount: 0,
      totalAmount: 1286.64,
      shippingAddress: {
        fullName: 'John Doe',
        phone: '+91 9876543211',
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      paymentId: 'pay_demo123',
      status: 'delivered',
      trackingNumber: 'TRK123456789',
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date()
    }
  ]);
  console.log('   ✓ Sample orders seeded');

  // Seed Sample Reviews
  await mongoose.connection.db.collection('reviews').insertMany([
    {
      _id: new ObjectId(),
      user: userIds.user,
      product: productIds[0],
      rating: 5,
      title: 'Excellent pen set!',
      comment: 'These pens write very smoothly and the ink quality is amazing. Highly recommend for daily use.',
      verified: true,
      status: 'approved',
      helpful: 12,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date()
    }
  ]);
  console.log('   ✓ Sample reviews seeded');
};

const createIndexes = async () => {
  // Users indexes
  await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
  await mongoose.connection.db.collection('users').createIndex({ status: 1 });
  console.log('   ✓ Users indexes created');
  
  // Products indexes
  await mongoose.connection.db.collection('products').createIndex({ name: 'text', description: 'text' });
  await mongoose.connection.db.collection('products').createIndex({ category: 1, status: 1 });
  await mongoose.connection.db.collection('products').createIndex({ brand: 1 });
  await mongoose.connection.db.collection('products').createIndex({ price: 1 });
  await mongoose.connection.db.collection('products').createIndex({ sku: 1 }, { unique: true });
  console.log('   ✓ Products indexes created');
  
  // Orders indexes
  await mongoose.connection.db.collection('orders').createIndex({ user: 1 });
  await mongoose.connection.db.collection('orders').createIndex({ status: 1 });
  await mongoose.connection.db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
  await mongoose.connection.db.collection('orders').createIndex({ createdAt: -1 });
  console.log('   ✓ Orders indexes created');
  
  // Reviews indexes
  await mongoose.connection.db.collection('reviews').createIndex({ product: 1 });
  await mongoose.connection.db.collection('reviews').createIndex({ user: 1 });
  console.log('   ✓ Reviews indexes created');
};

setupDatabase();
