require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Vaccine = require('./server/models/Vaccine');

// Import the vaccines data from the original file
const fs = require('fs');
const path = require('path');

// Read the original seedVaccines.js file to get the vaccines data
const seedFileContent = fs.readFileSync(path.join(__dirname, 'server', 'seedVaccines.js'), 'utf8');

// Extract the vaccines array from the file content
// This is a simplified approach - we'll define the vaccines directly here
const vaccines = [
  // Delhi Hospitals
  {
    name: 'COVID-19 Vaccine (Pfizer)',
    doseRequired: 2,
    availableQuantity: 100,
    location: {
      type: 'Point',
      coordinates: [77.2088, 28.6139], // New Delhi, India
      address: '123 Healthcare Ave',
      city: 'New Delhi',
      pinCode: '110001'
    }
  },
  {
    name: 'COVID-19 Vaccine (Moderna)',
    doseRequired: 2,
    availableQuantity: 80,
    location: {
      type: 'Point',
      coordinates: [77.22634, 28.63493], // Connaught Place, New Delhi
      address: '456 Medical Plaza',
      city: 'New Delhi',
      pinCode: '110001'
    }
  },
  {
    name: 'Hepatitis B Vaccine',
    doseRequired: 3,
    availableQuantity: 50,
    location: {
      type: 'Point',
      coordinates: [77.2599, 28.5952], // South Delhi
      address: '789 Wellness St',
      city: 'New Delhi',
      pinCode: '110048'
    }
  },
  {
    name: 'Influenza Vaccine',
    doseRequired: 1,
    availableQuantity: 120,
    location: {
      type: 'Point',
      coordinates: [77.1825, 28.5828], // West Delhi
      address: '101 Health Blvd',
      city: 'New Delhi',
      pinCode: '110028'
    }
  },
  {
    name: 'MMR Vaccine',
    doseRequired: 2,
    availableQuantity: 60,
    location: {
      type: 'Point',
      coordinates: [77.2728, 28.5417], // East Delhi
      address: '202 Immunization Rd',
      city: 'New Delhi',
      pinCode: '110092'
    }
  }
];

const seedVaccines = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing vaccines
    console.log('Clearing existing vaccines...');
    const deleteResult = await Vaccine.deleteMany({});
    console.log('🗑️  Cleared existing vaccines:', deleteResult.deletedCount);

    // Insert new vaccines
    console.log('Inserting new vaccines...');
    console.log('Number of vaccines to insert:', vaccines.length);
    
    const insertResult = await Vaccine.insertMany(vaccines);
    console.log('✅ Vaccines added successfully!', insertResult.length, 'vaccines inserted');

    // Verify insertion
    console.log('Verifying insertion...');
    const count = await Vaccine.countDocuments();
    console.log('Total vaccines in database now:', count);

    // List all vaccines
    if (count > 0) {
      const allVaccines = await Vaccine.find();
      console.log('Sample of inserted vaccines:');
      allVaccines.slice(0, 3).forEach((vaccine, index) => {
        console.log(`${index + 1}. ${vaccine.name} - Qty: ${vaccine.availableQuantity}`);
      });
    }

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedVaccines();