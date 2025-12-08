const express = require('express');
const Vaccine = require('../models/Vaccine');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/vaccines - public (or protect, as you wish)
router.get('/', async (req, res) => {
  try {
    const vaccines = await Vaccine.find();
    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vaccines - admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, doseRequired, availableQuantity } = req.body;
    const vaccine = await Vaccine.create({ name, doseRequired, availableQuantity });
    res.status(201).json(vaccine);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/vaccines/:id - admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vaccine) return res.status(404).json({ message: 'Vaccine not found' });
    res.json(vaccine);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/vaccines/:id - admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
    if (!vaccine) return res.status(404).json({ message: 'Vaccine not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
