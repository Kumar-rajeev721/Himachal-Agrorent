const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Land = require('../models/Land');
const { sendPaymentSuccessEmail } = require('../utils/sendEmail');

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('XXXX') || key_secret.includes('XXXX')) {
    throw new Error(
      'Razorpay keys are missing or still set to placeholder values. ' +
      'Open backend/.env and set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET ' +
      'with your real keys from https://dashboard.razorpay.com'
    );
  }

  return new Razorpay({ key_id, key_secret });
}

// POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { landId, startDate, endDate } = req.body;

    const land = await Land.findById(landId);
    if (!land) return res.status(404).json({ message: 'Land not found' });
    if (!land.isAvailable) return res.status(400).json({ message: 'Land is not available for booking' });

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return res.status(400).json({ message: 'Invalid date range' });
    const totalPrice = Math.ceil((days / 90) * land.pricePerSeason);

    const amountInPaise = totalPrice * 100;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        landId: landId.toString(),
        userId: req.user._id.toString(),
        startDate,
        endDate,
      },
    };

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      totalPrice,
      land: {
        title: land.title,
        location: land.location,
        pricePerSeason: land.pricePerSeason,
      },
    });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    res.status(500).json({ message: err.message || 'Failed to create payment order' });
  }
};

// POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      landId,
      startDate,
      endDate,
      userMessage,
      season,
      totalPrice,
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    const land = await Land.findById(landId);
    if (!land) return res.status(404).json({ message: 'Land not found' });

    const bookingPayload = {
      land: landId,
      user: req.user._id,
      farmer: land.farmer,
      startDate,
      endDate,
      totalPrice,
      userMessage: userMessage || '',
      status: 'pending',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: 'paid',
    };
    if (season) bookingPayload.season = season;

    const booking = await Booking.create(bookingPayload);

    // Send payment success email (non-blocking)
    sendPaymentSuccessEmail(req.user, booking, land);

    res.status(201).json({
      success: true,
      message: 'Payment successful! Booking created.',
      booking,
    });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({ message: err.message || 'Payment verification failed' });
  }
};

// GET /api/payment/key
exports.getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};
