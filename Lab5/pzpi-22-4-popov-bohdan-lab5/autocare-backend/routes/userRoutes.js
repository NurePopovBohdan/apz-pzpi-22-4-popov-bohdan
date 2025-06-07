const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const vehicleController = require('../controllers/vehicleController');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticate, userController.logoutUser);

// Protected user routes
router.post('/vehicles', authenticate, vehicleController.addVehicle);
router.delete('/vehicles/:vehicle_id', authenticate, vehicleController.deleteVehicle);
router.post('/maintenance', authenticate, maintenanceController.addMaintenance);

// Admin routes
router.get('/users', authenticate, authorize(['admin']), userController.getAllUsers);
router.delete('/users/:user_id', authenticate, authorize(['admin']), userController.deleteUser);
router.put('/users/:user_id/role', authenticate, authorize(['admin']), userController.updateUserRole);
router.get('/stats', authenticate, authorize(['admin']), userController.getSystemStats);

module.exports = router;