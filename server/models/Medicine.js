const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['tablet', 'syrup', 'ointment', 'other'], default: 'other' },
    stock: { type: Number, default: 0 },
    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', medicineSchema);
