// routes/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const Maintenance = require('../models/maintenance');
const { authenticate } = require('../middleware/authMiddleware'); // Додаємо автентифікацію

router.get('/vehicles/:id/maintenance', authenticate, async (req, res) => { // Додано authenticate
  try {
    const vehicleId = req.params.id;
    // Перевіряємо, чи є vehicleId валідним ObjectId
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ message: 'Invalid vehicle ID format' });
    }

    const maintenance = await Maintenance.find({ vehicle_id: vehicleId });
    if (!maintenance || maintenance.length === 0) {
      return res.status(404).json({ message: 'No maintenance records found for this vehicle' });
    }
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving maintenance issues', error: error.message });
  }
});

module.exports = router;