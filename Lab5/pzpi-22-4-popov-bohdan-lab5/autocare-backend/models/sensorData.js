const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  tirePressure: Number,
  batteryVoltage: Number,
  brakePadThickness: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
