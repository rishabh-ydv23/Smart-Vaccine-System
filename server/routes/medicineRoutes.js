const express = require('express');
const Medicine = require('../models/Medicine');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/medicines - user can view
router.get('/', async (req, res) => {
  try {
    const meds = await Medicine.find();
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/medicines - admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/medicines/:id - admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/medicines/:id - admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const med = await Medicine.findByIdAndDelete(req.params.id);
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
