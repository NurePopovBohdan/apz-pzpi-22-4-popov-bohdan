const mongoose = require('mongoose');
const Vehicle = require('../models/vehicle');

exports.addVehicle = async (req, res) => {
  const { make, model, year, vin_number } = req.body;

  try {
    // Використовуємо user_id з req.user, який встановлюється middleware authenticate
    if (!req.user || !mongoose.Types.ObjectId.isValid(req.user.user_id)) {
      return res.status(400).json({ message: 'Invalid user_id format' });
    }

    const userObjectId = new mongoose.Types.ObjectId(req.user.user_id);

    const vehicle = new Vehicle({
      user_id: userObjectId,
      make,
      model,
      year,
      vin_number,
    });

    await vehicle.save();

    res.status(201).json({ message: 'Vehicle added successfully', vehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    res.status(400).json({ message: 'Error adding vehicle', error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { vehicle_id } = req.params;

  try {
    const vehicle = await Vehicle.findByIdAndDelete(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error });
  }
};

// User vehicle management
exports.getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user_id: req.user.user_id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if the user owns this vehicle or is an admin
    if (vehicle.user_id.toString() !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this vehicle' });
    }
    
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
};

exports.getVehicleMaintenanceData = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if the user owns this vehicle or is an admin
    if (vehicle.user_id.toString() !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this vehicle' });
    }

    const maintenanceData = {
      tirePressure: Math.round((Math.random() * (35 - 25) + 25) * 10) / 10,
      batteryVoltage: Math.round((Math.random() * (14.4 - 11.5) + 11.5) * 10) / 10,
      brakePadThickness: Math.round((Math.random() * (12 - 2) + 2) * 10) / 10
    };
    
    res.json(maintenanceData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching maintenance data', error: error.message });
  }
};