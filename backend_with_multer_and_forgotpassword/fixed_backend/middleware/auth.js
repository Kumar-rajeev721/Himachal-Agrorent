const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET || 'himachal_agrorent_dev_secret_change_me';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access only' });
};

const farmerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'farmer' || req.user.role === 'admin')) return next();
  res.status(403).json({ message: 'Farmer access only' });
};

module.exports = { protect, adminOnly, farmerOnly };

