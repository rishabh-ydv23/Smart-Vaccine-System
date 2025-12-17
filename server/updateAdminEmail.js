require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const updateAdminEmail = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Find the existing admin user
    const existingAdmin = await User.findOne({ email: 'rishabh@admin@gmail.com' });
    if (!existingAdmin) {
      console.log('❌ Admin user not found with email: rishabh@admin@gmail.com');
      process.exit(1);
    }

    // Check if the new email already exists
    const emailExists = await User.findOne({ email: 'RishabhAdmin@gmail.com' });
    if (emailExists) {
      console.log('⚠️  User already exists with email: RishabhAdmin@gmail.com');
      process.exit(1);
    }

    // Update the admin email
    existingAdmin.email = 'RishabhAdmin@gmail.com';
    await existingAdmin.save();

    console.log('✅ Admin email updated successfully!');
    console.log('📧 New Email: RishabhAdmin@gmail.com');
    console.log('🔑 Password remains: Rishabh@Project');
    console.log('\nYou can now login with the new email');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

updateAdminEmail();