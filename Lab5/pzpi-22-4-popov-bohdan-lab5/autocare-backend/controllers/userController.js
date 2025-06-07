const bcrypt = require('bcrypt');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Maintenance = require('../models/maintenance');
const jwt = require('jsonwebtoken');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password_hash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  const { user_id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get system statistics (admin only)
exports.getSystemStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalVehicles: await Vehicle.countDocuments(),
      totalMaintenanceRecords: await Maintenance.countDocuments(),
      usersByRole: await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      vehiclesPerUser: await Vehicle.aggregate([
        { $group: { _id: '$user_id', count: { $sum: 1 } } },
        { $group: { _id: null, average: { $avg: '$count' } } }
      ])
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Registration
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password_hash,
      role: role || 'user',
    });

    await user.save();
    res.status(201).json({ message: 'User successfully registered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login (existing code)
exports.loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
          { user_id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600000
      });

      res.json({
          message: 'Login successful',
          user: {
              id: user._id,
              email: user.email,
              role: user.role,
              name: user.name
          }
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout (existing code)
exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Delete user's vehicles first
    await Vehicle.deleteMany({ user_id });
    
    // Delete user's maintenance records
    const userVehicles = await Vehicle.find({ user_id });
    const vehicleIds = userVehicles.map(vehicle => vehicle._id);
    await Maintenance.deleteMany({ vehicle_id: { $in: vehicleIds } });
    
    // Finally delete the user
    const user = await User.findByIdAndDelete(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};