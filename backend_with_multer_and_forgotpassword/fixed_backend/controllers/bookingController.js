const Booking = require('../models/Booking');
const Land = require('../models/Land');
const User = require('../models/User');
const {
  sendBookingConfirmationEmail,
  sendNewBookingAlertToFarmer,
  sendBookingStatusEmail,
} = require('../utils/sendEmail');

// POST /api/bookings - user creates booking
exports.createBooking = async (req, res) => {
  try {
    const { landId, startDate, endDate, userMessage, season } = req.body;
    const land = await Land.findOneAndUpdate(
      { _id: landId, isAvailable: true },
      { isAvailable: false },
      { new: true }
    );
    if (!land) return res.status(400).json({ message: 'Land not available' });

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = (days / 90) * land.pricePerSeason;

    const payload = {
      land: landId,
      user: req.user._id,
      farmer: land.farmer,
      startDate,
      endDate,
      totalPrice,
      userMessage,
    };
    if (season) payload.season = season;

    let booking;
    try {
      booking = await Booking.create(payload);
    } catch (createErr) {
      await Land.findByIdAndUpdate(landId, { isAvailable: true });
      throw createErr;
    }

    // Send emails (non-blocking)
    const farmer = await User.findById(land.farmer);
    sendBookingConfirmationEmail(req.user, booking, land);
    if (farmer) sendNewBookingAlertToFarmer(farmer, req.user, booking, land);

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/my - user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('land', 'title location images')
      .populate('farmer', 'name phone')
      .populate('season', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/farmer - farmer's received bookings
exports.getFarmerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ farmer: req.user._id })
      .populate('land', 'title location')
      .populate('user', 'name email phone')
      .populate('season', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/admin - all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('land', 'title location')
      .populate('user', 'name email')
      .populate('farmer', 'name email')
      .populate('season', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/bookings/:id/status - farmer approves/declines
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, farmerNote } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const previousStatus = booking.status;
    booking.status = status;
    if (farmerNote) booking.farmerNote = farmerNote;
    await booking.save();

    if (['approved', 'completed'].includes(status)) {
      await Land.findByIdAndUpdate(booking.land, { isAvailable: false });
    } else if (['declined', 'cancelled'].includes(status)) {
      await Land.findByIdAndUpdate(booking.land, { isAvailable: true });
    }

    // Send status update email to user (non-blocking)
    if (status === 'approved' || status === 'declined') {
      const bookingUser = await User.findById(booking.user);
      const bookingLand = await Land.findById(booking.land);
      if (bookingUser && bookingLand) {
        sendBookingStatusEmail(bookingUser, booking, bookingLand, status, farmerNote);
      }
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/bookings/:id/progress - farmer updates progress
exports.updateBookingProgress = async (req, res) => {
  try {
    const { farmingProgress, note } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.farmingProgress = farmingProgress;
    if (note) booking.progressNotes.push({ note, updatedBy: req.user._id });
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/:id - single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('land')
      .populate('user', 'name email phone')
      .populate('farmer', 'name email phone')
      .populate('season');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
