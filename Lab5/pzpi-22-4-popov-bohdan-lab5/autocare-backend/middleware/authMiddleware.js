const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Додаємо user до req з user_id, email, role
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = { authenticate };