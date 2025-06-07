const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const vehicleController = require('../controllers/vehicleController');

router.get('/vehicles', authenticate, authorize(['admin']), vehicleController.getAllVehicles);
router.get('/my-vehicles', authenticate, vehicleController.getUserVehicles);
router.get('/vehicles/:id', authenticate, vehicleController.getVehicleById);
router.get('/vehicles/:id/maintenance-data', authenticate, vehicleController.getVehicleMaintenanceData);

module.exports = router;
