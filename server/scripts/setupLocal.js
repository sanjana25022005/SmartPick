const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const setupLocal = async () => {
  console.log('🚀 Setting up SmartPick locally...\n');

  // Check if MongoDB is installed
  console.log('1. Checking MongoDB installation...');
  
  exec('mongod --version', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ MongoDB not found. Please install MongoDB:');
      console.log('   Windows: https://www.mongodb.com/try/download/community');
      console.log('   macOS: brew install mongodb-community');
      console.log('   Ubuntu: sudo apt-get install mongodb-org\n');
      
      console.log('🌐 Alternative: Use MongoDB Atlas (cloud):');
      console.log('   1. Go to https://www.mongodb.com/atlas');
      console.log('   2. Create free account');
      console.log('   3. Create cluster');
      console.log('   4. Get connection string');
      console.log('   5. Update MONGODB_URI in .env file\n');
      
      createExampleEnv();
      return;
    }
    
    console.log('✅ MongoDB found');
    console.log('2. Starting MongoDB...');
    
    // Try to start MongoDB
    startMongoDB();
  });
};

const startMongoDB = () => {
  const isWindows = process.platform === 'win32';
  const startCommand = isWindows ? 'net start MongoDB' : 'brew services start mongodb-community';
  
  exec(startCommand, (error, stdout, stderr) => {
    if (error) {
      console.log('⚠️  Could not start MongoDB service automatically.');
      console.log('   Please start MongoDB manually:');
      if (isWindows) {
        console.log('   - Run "net start MongoDB" as administrator');
        console.log('   - Or run "mongod" in command prompt');
      } else {
        console.log('   - Run "brew services start mongodb-community"');
        console.log('   - Or run "sudo systemctl start mongod"');
      }
    } else {
      console.log('✅ MongoDB started successfully');
    }
    
    console.log('\n3. Creating .env file...');
    createExampleEnv();
    
    console.log('\n4. Next steps:');
    console.log('   1. Update .env file with your settings');
    console.log('   2. Run: npm install');
    console.log('   3. Run: node scripts/setupDatabase.js');
    console.log('   4. Run: npm run dev');
  });
};

const createExampleEnv = () => {
  const envContent = `NODE_ENV=development
PORT=5000

# Local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/smartpick

# Or use MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smartpick?retryWrites=true&w=majority

JWT_SECRET=${generateRandomString(64)}
JWT_EXPIRE=30d

# Email Configuration (optional for development)
EMAIL_FROM=noreply@smartpick.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Payment Gateway (optional for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10000000

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
`;

  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created');
  } else {
    console.log('⚠️  .env file already exists');
  }
};

const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

setupLocal();
