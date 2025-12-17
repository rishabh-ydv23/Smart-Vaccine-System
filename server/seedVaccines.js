require('dotenv').config();
const mongoose = require('mongoose');
const Vaccine = require('./models/Vaccine');

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
  },
  {
    name: 'Tetanus Vaccine',
    doseRequired: 1,
    availableQuantity: 90,
    location: {
      type: 'Point',
      coordinates: [77.1092, 28.6515], // North Delhi
      address: '303 Protection Ln',
      city: 'New Delhi',
      pinCode: '110084'
    }
  },
  
  // Punjab Government Hospitals
  {
    name: 'Government Medical College & Hospital',
    doseRequired: 2,
    availableQuantity: 150,
    location: {
      type: 'Point',
      coordinates: [75.8572, 30.9010], // Amritsar, Punjab
      address: 'Government Medical College, Civil Lines',
      city: 'Amritsar',
      pinCode: '143001'
    }
  },
  {
    name: 'Civil Hospital',
    doseRequired: 1,
    availableQuantity: 200,
    location: {
      type: 'Point',
      coordinates: [75.5725, 31.3256], // Ludhiana, Punjab
      address: 'Civil Hospital Road, Jail Road',
      city: 'Ludhiana',
      pinCode: '141001'
    }
  },
  {
    name: 'Government Medical College',
    doseRequired: 3,
    availableQuantity: 120,
    location: {
      type: 'Point',
      coordinates: [74.8719, 31.6340], // Patiala, Punjab
      address: 'Government Medical College, Rajpura Road',
      city: 'Patiala',
      pinCode: '147001'
    }
  },
  {
    name: 'Sher-i-Kashmir Institute of Medical Sciences',
    doseRequired: 2,
    availableQuantity: 100,
    location: {
      type: 'Point',
      coordinates: [76.7794, 30.7333], // Chandigarh (near Punjab border)
      address: 'Sector 24, Institutional Area',
      city: 'Chandigarh',
      pinCode: '160024'
    }
  },
  {
    name: 'District Headquarters Hospital',
    doseRequired: 1,
    availableQuantity: 80,
    location: {
      type: 'Point',
      coordinates: [75.0794, 31.5145], // Jalandhar, Punjab
      address: 'Model Town, GT Road',
      city: 'Jalandhar',
      pinCode: '144003'
    }
  },
  {
    name: 'Government Medical College',
    doseRequired: 2,
    availableQuantity: 90,
    location: {
      type: 'Point',
      coordinates: [75.3833, 31.9010], // Bathinda, Punjab
      address: 'Government Medical College, Kapurthala Road',
      city: 'Bathinda',
      pinCode: '151001'
    }
  }
];

const seedVaccines = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing vaccines
    await Vaccine.deleteMany({});
    console.log('🗑️  Cleared existing vaccines');

    // Insert new vaccines
    await Vaccine.insertMany(vaccines);
    console.log('✅ Vaccines added successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedVaccines();
