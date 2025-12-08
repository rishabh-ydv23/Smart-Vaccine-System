const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    doseRequired: { type: Number, default: 1 },
    availableQuantity: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vaccine', vaccineSchema);
