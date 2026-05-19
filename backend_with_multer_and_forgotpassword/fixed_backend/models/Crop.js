const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
    growthPeriod: { type: Number }, // days
    waterRequirement: { type: String, enum: ['low', 'medium', 'high'] },
    soilType: [{ type: String }],
    image: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    land: { type: mongoose.Schema.Types.ObjectId, ref: 'Land' },
    aiRiskScore: { type: Number, default: 0 }, // 0-100
    aiTips: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
