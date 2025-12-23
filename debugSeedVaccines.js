require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Vaccine = require('./server/models/Vaccine');

// Sample vaccines data
const vaccines = [
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
  }
];

const seedVaccines = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing vaccines
    const deleteResult = await Vaccine.deleteMany({});
    console.log('🗑️  Cleared existing vaccines:', deleteResult.deletedCount);

    // Insert new vaccines
    console.log('Inserting vaccines:', vaccines.length);
    const insertResult = await Vaccine.insertMany(vaccines);
    console.log('✅ Vaccines added successfully!', insertResult.length);

    // Verify insertion
    const count = await Vaccine.countDocuments();
    console.log('Total vaccines in database now:', count);

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    mongoose.connection.close();
  }
};

seedVaccines();