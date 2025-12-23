require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vaccine.com';
    
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set');
      console.error('Example: ADMIN_EMAIL=your_admin@example.com ADMIN_PASSWORD=your_secure_password node createAdmin.js');
      process.exit(1);
    }
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('Email:', adminEmail);
      console.log('Use the password you set in ADMIN_PASSWORD environment variable');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      governmentId: process.env.ADMIN_GOV_ID || 'ADMIN001',
      role: 'admin'
    });
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', process.env.ADMIN_EMAIL);
    console.log('🔑 Password: Set from ADMIN_PASSWORD environment variable');
    console.log('\nYou can now login and access /admin route');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

createAdmin();