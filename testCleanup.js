const mongoose = require('mongoose');

// Test MongoDB connection
const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Use the connection string directly
    const uri = 'mongodb+srv://smartvaccineuser:CHANGE_ME_MONGODB_PASSWORD@smartvaccine.uvb3wyh.mongodb.net/?appName=SmartVaccine';
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Try to access the User model
    const User = require('./server/models/User');
    
    // Search for the problematic email
    console.log('🔍 Searching for CHANGE_ME_ADMIN_EMAIL...');
    const users = await User.find({
      email: { $regex: new RegExp('^CHANGE_ME_ADMIN_EMAIL$', 'i') }
    });
    
    console.log(`📊 Found ${users.length} user(s) with that email:`);
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - ${user.email} (${user._id})`);
      });
      
      // Delete the users
      const result = await User.deleteMany({
        email: { $regex: new RegExp('^CHANGE_ME_ADMIN_EMAIL$', 'i') }
      });
      
      console.log(`🗑️  Deleted ${result.deletedCount} user(s)!`);
    } else {
      console.log('✅ No accounts found with that email. You should be able to register now.');
      
      // Show all current users
      console.log('\n📋 Current users in database:');
      const allUsers = await User.find({}, { email: 1, name: 1, _id: 1, role: 1 });
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('🔧 Troubleshooting tips:');
    console.log('   - Check your internet connection');
    console.log('   - Verify MongoDB Atlas cluster is running');
    console.log('   - Check if IP whitelist includes your current IP');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed.');
    }
  }
};

testConnection();