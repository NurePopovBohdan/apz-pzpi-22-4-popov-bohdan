const Maintenance = require('../models/maintenance');

// Добавить обслуживание
exports.addMaintenance = async (req, res) => {
  const { vehicle_id, maintenance_type, maintenance_date, mileage, comments } = req.body;

  try {
    const maintenance = new Maintenance({ vehicle_id, maintenance_type, maintenance_date, mileage, comments });
    await maintenance.save();
    res.status(201).json({ message: 'Maintenance record added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding maintenance record', error: error.message });
  }
};
