#!/usr/bin/env node

/**
 * Database Diagnostic Tool
 * Helps identify database connection and user accounts
 */

const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: './server/.env' });

const diagnoseDatabase = async () => {
  try {
    console.log('🔍 Database Diagnostic Tool');
    console.log('==========================\n');
    
    // Show connection details
    console.log('📡 Connection Details:');
    console.log(`   Host: smartvaccine.uvb3wyh.mongodb.net`);
    console.log(`   Database: SmartVaccine`);
    console.log(`   Username: smartvaccineuser`);
    console.log(`   Connection String: ${process.env.MONGO_URI}\n`);
    
    // Connect to database
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Connected successfully!\n');
    
    // List all collections
    console.log('📚 Available Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    
    console.log('');
    
    // Check users collection specifically
    const User = require('./server/models/User');
    const userCount = await User.countDocuments();
    
    console.log(`👥 Users Collection:`);
    console.log(`   Total users: ${userCount}`);
    
    if (userCount > 0) {
      console.log(`   Sample users:`);
      const sampleUsers = await User.find({}, { email: 1, name: 1, createdAt: 1 }).limit(5);
      sampleUsers.forEach((user, index) => {
        console.log(`     ${index + 1}. ${user.name} - ${user.email}`);
      });
      
      // Search for the specific email
      console.log(`\n🔍 Searching for CHANGE_ME_ADMIN_EMAIL:`);
      const searchResults = await User.find({
        email: { $regex: new RegExp('CHANGE_ME_ADMIN_EMAIL', 'i') }
      });
      
      if (searchResults.length > 0) {
        console.log(`   Found ${searchResults.length} matching account(s):`);
        searchResults.forEach((user, index) => {
          console.log(`     ${index + 1}. ${user.name} - ${user.email} (Created: ${user.createdAt})`);
        });
      } else {
        console.log(`   No accounts found with that email`);
      }
    }
    
    // Check indexes
    console.log(`\n.CreateIndexes:`);
    const indexes = await mongoose.connection.db.collection('users').indexes();
    console.log(`   Email index: ${indexes.some(idx => idx.key.email) ? '✅ Exists' : '❌ Missing'}`);
    console.log(`   Unique email constraint: ${indexes.some(idx => idx.key.email && idx.unique) ? '✅ Enforced' : '❌ Not enforced'}`);
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   - Check your internet connection');
    console.log('   - Verify MongoDB Atlas cluster is running');
    console.log('   - Check if IP whitelist includes your current IP');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Disconnected from database');
    }
  }
};

diagnoseDatabase();