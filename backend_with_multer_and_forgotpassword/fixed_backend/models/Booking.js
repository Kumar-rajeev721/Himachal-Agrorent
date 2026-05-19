const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    land: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined', 'cancelled', 'completed'],
      default: 'pending',
    },
    farmingProgress: {
      type: String,
      enum: ['not_started', 'soil_prep', 'planting', 'growing', 'harvesting', 'completed'],
      default: 'not_started',
    },
    progressNotes: [
      {
        note: String,
        date: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    userMessage: { type: String },
    farmerNote: { type: String },
    // Razorpay payment fields
    paymentId: { type: String, default: null },       // razorpay_payment_id
    orderId: { type: String, default: null },          // razorpay_order_id
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
