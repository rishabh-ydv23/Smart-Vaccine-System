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

// GET /api/vaccines/nearby - find nearby vaccination centers
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10, city, pinCode } = req.query;
    
    let query = {};
    
    // Search by coordinates and radius
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }
    
    // Search by city
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    // Search by PIN code
    if (pinCode) {
      query['location.pinCode'] = pinCode;
    }
    
    const vaccines = await Vaccine.find(query);
    res.json(vaccines);
  } catch (err) {
    console.error('Nearby search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vaccines/search - search by city or PIN code
router.get('/search', async (req, res) => {
  try {
    const { city, pinCode } = req.query;
    
    let query = {};
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (pinCode) {
      query['location.pinCode'] = pinCode;
    }
    
    const vaccines = await Vaccine.find(query);
    res.json(vaccines);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vaccines - admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, doseRequired, availableQuantity, location } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Vaccine name is required' });
    }
    
    // Create vaccine with location if provided, otherwise without location
    const vaccineData = { name, doseRequired, availableQuantity };
    if (location) {
      vaccineData.location = location;
    }
    
    const vaccine = await Vaccine.create(vaccineData);
    res.status(201).json(vaccine);
  } catch (err) {
    console.error('Error adding vaccine:', err);
    
    // Check if it's a validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/vaccines/:id - admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, doseRequired, availableQuantity, location } = req.body;
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (doseRequired !== undefined) updateData.doseRequired = doseRequired;
    if (availableQuantity !== undefined) updateData.availableQuantity = availableQuantity;
    if (location) updateData.location = location;
    
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!vaccine) return res.status(404).json({ message: 'Vaccine not found' });
    res.json(vaccine);
  } catch (err) {
    console.error('Error updating vaccine:', err);
    
    // Check if it's a validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error', error: err.message });
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
