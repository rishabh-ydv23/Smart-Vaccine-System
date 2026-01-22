#!/usr/bin/env node

/**
 * User Account Cleanup Utility
 * Helps remove duplicate or problematic user accounts
 * Usage: node cleanupAccounts.js [email]
 */

const mongoose = require('mongoose');
const { normalizeEmail, sanitizeEmailForLogging } = require('./server/utils/emailUtils');

// Load environment variables
require('dotenv').config({ path: './server/.env' });

const User = require('./server/models/User');

/**
 * Cleanup accounts by email
 * @param {string} email - Email to search for and remove
 */
const cleanupByEmail = async (email) => {
  try {
    console.log('🔍 Starting cleanup process...');
    
    // Normalize the email
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      console.error('❌ Invalid email format provided');
      return;
    }
    
    console.log(`📧 Looking for accounts with: ${sanitizeEmailForLogging(normalizedEmail)}`);
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Connected to database');
    
    // Find all matching accounts (case-insensitive)
    const users = await User.find({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
    });
    
    console.log(`📊 Found ${users.length} account(s)`);
    
    if (users.length > 0) {
      console.log('\n📋 Matching accounts:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - ${sanitizeEmailForLogging(user.email)} (${user.role})`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('---');
      });
      
      // Ask for confirmation (in interactive mode)
      console.log('\n⚠️  This will permanently delete these accounts!');
      
      // Delete the accounts
      const result = await User.deleteMany({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
      });
      
      console.log(`🗑️  Successfully deleted ${result.deletedCount} account(s)`);
      console.log('✅ You can now register with this email address');
      
    } else {
      console.log('✅ No accounts found with that email address');
      console.log('📊 Current user count:', await User.countDocuments());
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    }
  }
};

/**
 * List all users (for debugging)
 */
const listAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('📋 All registered users:');
    const users = await User.find({}, { email: 1, name: 1, role: 1, createdAt: 1, isEmailVerified: 1 });
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${sanitizeEmailForLogging(user.email)} (${user.role})`);
      console.log(`   Verified: ${user.isEmailVerified ? '✅' : '❌'} | Created: ${user.createdAt.toLocaleDateString()}`);
    });
    
    console.log(`\n📈 Total users: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
};

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];
const email = args[1];

if (command === 'cleanup' && email) {
  cleanupByEmail(email);
} else if (command === 'list') {
  listAllUsers();
} else {
  console.log(`
📋 User Account Cleanup Utility

Usage:
  node cleanupAccounts.js cleanup <email>    - Remove accounts by email
  node cleanupAccounts.js list               - List all users
  
Examples:
  node cleanupAccounts.js cleanup user@example.com
  node cleanupAccounts.js list

This tool helps manage user accounts and resolve duplicate email issues.
  `);
}