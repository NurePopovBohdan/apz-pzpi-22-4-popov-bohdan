const mongoose = require('mongoose');

const IoTDataSchema = new mongoose.Schema({
  tirePressure: {
    type: Number,
    required: true,
  },
  batteryVoltage: {
    type: Number,
    required: true,
  },
  brakePadThickness: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('IoTData', IoTDataSchema);
