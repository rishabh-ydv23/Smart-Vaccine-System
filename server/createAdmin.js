require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@vaccine.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('Email:', process.env.ADMIN_EMAIL || 'admin@vaccine.com');
      console.log('Use the password you created during registration');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@vaccine.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      governmentId: process.env.ADMIN_GOV_ID || 'ADMIN001',
      role: 'admin'
    });
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', process.env.ADMIN_EMAIL || 'admin@vaccine.com');
    console.log('🔑 Password: [Check your .env file for ADMIN_PASSWORD]');
    console.log('\nYou can now login and access /admin route');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

createAdmin();