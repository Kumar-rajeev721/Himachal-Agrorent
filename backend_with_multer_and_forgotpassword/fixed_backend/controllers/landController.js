const Land = require('../models/Land');
require('../models/Crop');
require('../models/Season');
require('../models/User');

// GET /api/lands - public: list approved+available lands
exports.getLands = async (req, res) => {
  try {
    const { location, season, available } = req.query;
    const filter = { status: 'approved' };
    if (available === 'true') filter.isAvailable = true;
    if (location) filter.location = new RegExp(location, 'i');
    if (season) filter.season = season;

    const lands = await Land.find(filter)
      .populate('farmer', 'name email phone')
      .populate('season', 'name')
      .populate('crops', 'name');
    res.json(lands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/lands/:id - public
exports.getLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id)
      .populate('farmer', 'name email phone')
      .populate('season')
      .populate('crops');
    if (!land) return res.status(404).json({ message: 'Land not found' });
    res.json(land);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/lands - farmer adds land
exports.addLand = async (req, res) => {
  try {
    const payload = { ...req.body, farmer: req.user._id };
    if (!payload.season) delete payload.season;

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      payload.images = req.files.map(f => `/uploads/lands/${f.filename}`);
    }

    // Parse amenities if sent as comma-separated string
    if (typeof payload.amenities === 'string') {
      payload.amenities = payload.amenities.split(',').map(a => a.trim()).filter(Boolean);
    }

    const land = await Land.create(payload);
    res.status(201).json(land);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/lands/:id - farmer updates own land
exports.updateLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ message: 'Land not found' });
    if (land.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const updateData = { ...req.body };

    // Handle uploaded images (replace existing if new ones uploaded)
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => `/uploads/lands/${f.filename}`);
    }

    // Parse amenities if sent as comma-separated string
    if (typeof updateData.amenities === 'string') {
      updateData.amenities = updateData.amenities.split(',').map(a => a.trim()).filter(Boolean);
    }

    const updated = await Land.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/lands/:id/approve - admin approves/rejects
exports.approveLand = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const land = await Land.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );
    res.json(land);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/lands/:id/availability - farmer sets availability
exports.setAvailability = async (req, res) => {
  try {
    const land = await Land.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    res.json(land);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/lands/farmer/my - farmer's own lands
exports.getMyLands = async (req, res) => {
  try {
    const lands = await Land.find({ farmer: req.user._id })
      .populate('season', 'name')
      .populate('crops', 'name');
    res.json(lands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/lands/admin/all - admin: all lands
exports.getAllLands = async (req, res) => {
  try {
    const lands = await Land.find()
      .populate('farmer', 'name email')
      .populate('season', 'name');
    res.json(lands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
