const Season = require('../models/Season');

// GET all seasons
exports.getSeasons = async (req, res) => {
  try {
    const seasons = await Season.find();
    res.json(seasons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add season (admin)
exports.addSeason = async (req, res) => {
  try {
    const season = await Season.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(season);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update season (admin)
exports.updateSeason = async (req, res) => {
  try {
    const season = await Season.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(season);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE season (admin)
exports.deleteSeason = async (req, res) => {
  try {
    await Season.findByIdAndDelete(req.params.id);
    res.json({ message: 'Season deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
