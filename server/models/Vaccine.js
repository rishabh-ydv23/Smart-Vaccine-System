const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    doseRequired: { type: Number, default: 1 },
    availableQuantity: { type: Number, default: 0 },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number] }, // [longitude, latitude]
      address: String,
      city: String,
      pinCode: String
    }
  },
  { timestamps: true }
);

// Create geospatial index for location
vaccineSchema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('Vaccine', vaccineSchema);
