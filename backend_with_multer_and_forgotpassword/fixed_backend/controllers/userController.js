const User = require('../models/User');

// GET all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all farmers (admin/user)
exports.getFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH toggle user active status (admin)
exports.toggleUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id).select('isActive role');
    if (!existingUser) return res.status(404).json({ message: 'User not found' });
    if (existingUser.role === 'admin') {
      return res.status(400).json({ message: 'Admin users cannot be deactivated' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: !existingUser.isActive } },
      { new: true, runValidators: false }
    ).select('-password');

    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update own profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
