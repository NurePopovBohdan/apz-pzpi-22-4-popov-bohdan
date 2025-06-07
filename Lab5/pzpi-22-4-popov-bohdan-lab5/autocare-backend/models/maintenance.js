const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  maintenance_type: { type: String, required: true },
  maintenance_date: { type: Date, required: true },
  mileage: { type: Number, required: true },
  comments: { type: String, required: false },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);