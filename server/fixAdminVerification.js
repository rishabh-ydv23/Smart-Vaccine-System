/**
 * Fix Admin Email Verification Status
 * This script updates the admin account to be email verified
 * Usage: node fixAdminVerification.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const fixAdminVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaccine-system');
    console.log('✅ MongoDB connected');

    const adminEmail = 'admin@vaccine.com';

    // Find the admin user
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('❌ Admin user not found with email:', adminEmail);
      console.log('\n📋 Available users in database:');
      const allUsers = await User.find({}, 'email role isEmailVerified');
      console.table(allUsers);
      process.exit(1);
    }

    console.log('📧 Admin found:');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Email Verified:', admin.isEmailVerified);

    if (admin.isEmailVerified) {
      console.log('\n✅ Admin is already email verified! No changes needed.');
      process.exit(0);
    }

    // Update email verification status
    admin.isEmailVerified = true;
    await admin.save();

    console.log('\n✅ Admin email verification status updated!');
    console.log('   Email Verified: Now set to TRUE');
    console.log('\n🔐 You can now login with:');
    console.log('   Email: admin@vaccine.com');
    console.log('   Password: (Use your ADMIN_PASSWORD environment variable)');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

fixAdminVerification();
