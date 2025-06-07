// models/vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin_number: { type: String, required: true },
  tirePressure: { type: Number, default: null },
  batteryVoltage: { type: Number, default: null },
  brakePadThickness: { type: Number, default: null }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
