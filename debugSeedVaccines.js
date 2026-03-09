require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const Vaccine = require('./server/models/Vaccine');

// Sample vaccines data
const vaccines = [
  {
    name: 'BCG – Tuberculosis (TB)',
    doseRequired: 1,
    availableQuantity: 120,
    location: { type: 'Point', coordinates: [77.2088, 28.6139], address: '123 Healthcare Ave', city: 'New Delhi', pinCode: '110001' }
  },
  {
    name: 'OPV (Oral Polio Vaccine) – Polio',
    doseRequired: 3,
    availableQuantity: 150,
    location: { type: 'Point', coordinates: [77.22634, 28.63493], address: '456 Medical Plaza', city: 'New Delhi', pinCode: '110001' }
  },
  {
    name: 'IPV (Inactivated Polio Vaccine) – Polio',
    doseRequired: 2,
    availableQuantity: 100,
    location: { type: 'Point', coordinates: [77.2599, 28.5952], address: '789 Wellness St', city: 'New Delhi', pinCode: '110048' }
  },
  {
    name: 'MMR – Measles, Mumps, Rubella',
    doseRequired: 2,
    availableQuantity: 90,
    location: { type: 'Point', coordinates: [77.2100, 28.6100], address: '12 Immunity Rd', city: 'New Delhi', pinCode: '110002' }
  },
  {
    name: 'DPT – Diphtheria, Pertussis, Tetanus',
    doseRequired: 3,
    availableQuantity: 130,
    location: { type: 'Point', coordinates: [77.2150, 28.6200], address: '34 Vaccine Ln', city: 'New Delhi', pinCode: '110003' }
  },
  {
    name: 'Hepatitis B Vaccine – Hepatitis B',
    doseRequired: 3,
    availableQuantity: 50,
    location: { type: 'Point', coordinates: [77.2599, 28.5952], address: '789 Wellness St', city: 'New Delhi', pinCode: '110048' }
  },
  {
    name: 'Hepatitis A Vaccine – Hepatitis A',
    doseRequired: 2,
    availableQuantity: 60,
    location: { type: 'Point', coordinates: [77.2200, 28.6300], address: '56 Healthy Blvd', city: 'New Delhi', pinCode: '110004' }
  },
  {
    name: 'HPV Vaccine – Human Papillomavirus',
    doseRequired: 2,
    availableQuantity: 70,
    location: { type: 'Point', coordinates: [77.2300, 28.6400], address: '78 Prevention Ave', city: 'New Delhi', pinCode: '110005' }
  },
  {
    name: 'Varicella Vaccine – Chickenpox',
    doseRequired: 2,
    availableQuantity: 80,
    location: { type: 'Point', coordinates: [77.2400, 28.6500], address: '90 Care St', city: 'New Delhi', pinCode: '110006' }
  },
  {
    name: 'Influenza Vaccine – Flu',
    doseRequired: 1,
    availableQuantity: 200,
    location: { type: 'Point', coordinates: [77.2500, 28.6600], address: '101 Seasonal Rd', city: 'New Delhi', pinCode: '110007' }
  },
  {
    name: 'Rabies Vaccine – Rabies',
    doseRequired: 3,
    availableQuantity: 40,
    location: { type: 'Point', coordinates: [77.2600, 28.6700], address: '202 Emergency Ave', city: 'New Delhi', pinCode: '110008' }
  },
  {
    name: 'Typhoid Vaccine – Typhoid',
    doseRequired: 1,
    availableQuantity: 110,
    location: { type: 'Point', coordinates: [77.2700, 28.6800], address: '303 Sanitation St', city: 'New Delhi', pinCode: '110009' }
  },
  {
    name: 'COVID-19 Vaccine (Covaxin)',
    doseRequired: 2,
    availableQuantity: 140,
    location: { type: 'Point', coordinates: [77.2088, 28.6139], address: '123 Healthcare Ave', city: 'New Delhi', pinCode: '110001' }
  },
  {
    name: 'COVID-19 Vaccine (Covishield)',
    doseRequired: 2,
    availableQuantity: 160,
    location: { type: 'Point', coordinates: [77.22634, 28.63493], address: '456 Medical Plaza', city: 'New Delhi', pinCode: '110001' }
  },
  {
    name: 'Pneumococcal Vaccine (PCV) – Pneumonia',
    doseRequired: 3,
    availableQuantity: 75,
    location: { type: 'Point', coordinates: [77.2800, 28.6900], address: '404 Lungs Rd', city: 'New Delhi', pinCode: '110010' }
  },
  {
    name: 'Rotavirus Vaccine – Rotavirus infection',
    doseRequired: 2,
    availableQuantity: 95,
    location: { type: 'Point', coordinates: [77.2900, 28.7000], address: '505 Infant Care', city: 'New Delhi', pinCode: '110011' }
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