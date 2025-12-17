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
