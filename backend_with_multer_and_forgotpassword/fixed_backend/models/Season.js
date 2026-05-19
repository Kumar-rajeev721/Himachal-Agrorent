const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startMonth: { type: Number, required: true }, // 1-12
    endMonth: { type: Number, required: true },
    description: { type: String },
    recommendedCrops: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Season', seasonSchema);
