const Crop = require('../models/Crop');

// GET all crops
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate('season', 'name').populate('land', 'title');
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add crop (farmer/admin)
exports.addCrop = async (req, res) => {
  try {
    const crop = await Crop.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update crop
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE crop (admin)
exports.deleteCrop = async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
