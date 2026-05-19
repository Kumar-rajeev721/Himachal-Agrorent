const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    area: { type: Number, required: true }, // in acres
    pricePerSeason: { type: Number, required: true },
    soilType: { type: String },
    waterSource: { type: String },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isAvailable: { type: Boolean, default: true },
    season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
    crops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop' }],
    amenities: [{ type: String }],
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Land', landSchema);
