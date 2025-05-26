const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Try multiple connection strings
    const connectionStrings = [
      'mongodb://127.0.0.1:27017/smartpick',
      'mongodb://localhost:27017/smartpick'
    ];
    
    for (const uri of connectionStrings) {
      try {
        console.log(`   Trying: ${uri}`);
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        console.log('✅ MongoDB connected successfully!');
        
        // Test basic operation
        const admin = mongoose.connection.db.admin();
        const result = await admin.ping();
        console.log('📡 Ping result:', result);
        
        // List databases
        const databases = await admin.listDatabases();
        console.log('📁 Available databases:', databases.databases.map(db => db.name));
        
        await mongoose.disconnect();
        console.log('🎉 Connection test passed!');
        return;
      } catch (error) {
        console.log(`   Failed: ${error.message}`);
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
      }
    }
    
    throw new Error('All connection attempts failed');
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    
    console.log('\n💡 Troubleshooting steps:');
    console.log('1. Make sure MongoDB is running:');
    console.log('   mongod --dbpath "C:\\data\\db"');
    console.log('2. Check if mongod process is running:');
    console.log('   tasklist | findstr mongod');
    console.log('3. Try connecting manually:');
    console.log('   mongosh mongodb://127.0.0.1:27017');
    
    process.exit(1);
  }
};

testConnection();
