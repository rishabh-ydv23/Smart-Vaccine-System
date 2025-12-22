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
  {
    name: 'Chickenpox (Varicella) Vaccine',
    doseRequired: 2,
    availableQuantity: 75,
    location: {
      type: 'Point',
      coordinates: [77.2088, 28.6139], // New Delhi, India
      address: '123 Healthcare Ave',
      city: 'New Delhi',
      pinCode: '110001'
    }
  },
  {
    name: 'Dengue Vaccine',
    doseRequired: 3,
    availableQuantity: 60,
    location: {
      type: 'Point',
      coordinates: [77.22634, 28.63493], // Connaught Place, New Delhi
      address: '456 Medical Plaza',
      city: 'New Delhi',
      pinCode: '110001'
    }
  },
  {
    name: 'Diphtheria Vaccine',
    doseRequired: 5,
    availableQuantity: 100,
    location: {
      type: 'Point',
      coordinates: [77.2599, 28.5952], // South Delhi
      address: '789 Wellness St',
      city: 'New Delhi',
      pinCode: '110048'
    }
  },
  {
    name: 'Hepatitis A Vaccine',
    doseRequired: 2,
    availableQuantity: 80,
    location: {
      type: 'Point',
      coordinates: [77.1825, 28.5828], // West Delhi
      address: '101 Health Blvd',
      city: 'New Delhi',
      pinCode: '110028'
    }
  },
  {
    name: 'Hib (Haemophilus influenzae type b) Vaccine',
    doseRequired: 4,
    availableQuantity: 70,
    location: {
      type: 'Point',
      coordinates: [77.2728, 28.5417], // East Delhi
      address: '202 Immunization Rd',
      city: 'New Delhi',
      pinCode: '110092'
    }
  },
  // Phagwara Hospitals
  {
    name: 'COVID-19 Vaccine',
    doseRequired: 2,
    availableQuantity: 150,
    location: {
      type: 'Point',
      coordinates: [75.7708, 31.2240], // Civil Hospital, Phagwara
      address: 'Chahal Nagar, Phagwara, Punjab 144401, India',
      city: 'Phagwara',
      pinCode: '144401'
    }
  },
  {
    name: 'Hepatitis B Vaccine',
    doseRequired: 3,
    availableQuantity: 100,
    location: {
      type: 'Point',
      coordinates: [75.7708, 31.2240], // Civil Hospital, Phagwara
      address: 'Chahal Nagar, Phagwara, Punjab 144401, India',
      city: 'Phagwara',
      pinCode: '144401'
    }
  },
  {
    name: 'Influenza Vaccine',
    doseRequired: 1,
    availableQuantity: 120,
    location: {
      type: 'Point',
      coordinates: [75.7190, 31.2280], // PHC Autholi, Phagwara
      address: 'Unnamed Road, Athouli, Phagwara, Punjab 144402, India',
      city: 'Phagwara',
      pinCode: '144402'
    }
  },
  {
    name: 'MMR Vaccine',
    doseRequired: 2,
    availableQuantity: 80,
    location: {
      type: 'Point',
      coordinates: [75.7190, 31.2280], // PHC Autholi, Phagwara
      address: 'Unnamed Road, Athouli, Phagwara, Punjab 144402, India',
      city: 'Phagwara',
      pinCode: '144402'
    }
  },
  {
    name: 'Tetanus Vaccine',
    doseRequired: 1,
    availableQuantity: 90,
    location: {
      type: 'Point',
      coordinates: [75.7650, 31.2200], // Aam Admi Clinic, Phagwara
      address: 'Khothra Rd, Kaulsar, Friends Colony, Phagwara Sharki, Punjab 144401, India',
      city: 'Phagwara',
      pinCode: '144401'
    }
  },
  {
    name: 'Chickenpox (Varicella) Vaccine',
    doseRequired: 2,
    availableQuantity: 75,
    location: {
      type: 'Point',
      coordinates: [75.7650, 31.2200], // Aam Admi Clinic, Phagwara
      address: 'Khothra Rd, Kaulsar, Friends Colony, Phagwara Sharki, Punjab 144401, India',
      city: 'Phagwara',
      pinCode: '144401'
    }
  },
  {
    name: 'Dengue Vaccine',
    doseRequired: 3,
    availableQuantity: 60,
    location: {
      type: 'Point',
      coordinates: [75.7750, 31.2300], // ESI Hospital, Phagwara
      address: 'Phagwara HO, Phagwara – 144401, Punjab',
      city: 'Phagwara',
      pinCode: '144401'
    }
  },
  {
    name: 'Diphtheria Vaccine',
    doseRequired: 5,
    availableQuantity: 100,
    location: {
      type: 'Point',
      coordinates: [75.7750, 31.2300], // ESI Hospital, Phagwara
      address: 'Phagwara HO, Phagwara – 144401, Punjab',
      city: 'Phagwara',
      pinCode: '144401'
    }
  },
  {
    name: 'Hepatitis A Vaccine',
    doseRequired: 2,
    availableQuantity: 80,
    location: {
      type: 'Point',
      coordinates: [75.7600, 31.2150], // Manjit Singh Bal Hospital, Phagwara
      address: 'Near Sondhi Gas Agency, Hargobind Nagar, Phagwara',
      city: 'Phagwara',
      pinCode: '144401'
    }
  },
  {
    name: 'Hib (Haemophilus influenzae type b) Vaccine',
    doseRequired: 4,
    availableQuantity: 70,
    location: {
      type: 'Point',
      coordinates: [75.7600, 31.2150], // Manjit Singh Bal Hospital, Phagwara
      address: 'Near Sondhi Gas Agency, Hargobind Nagar, Phagwara',
      city: 'Phagwara',
      pinCode: '144401'
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
