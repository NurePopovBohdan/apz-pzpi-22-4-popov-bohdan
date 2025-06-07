const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  notification_type: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'unread' }
});

module.exports = mongoose.model('Notification', notificationSchema);
