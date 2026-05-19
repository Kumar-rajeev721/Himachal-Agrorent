const express = require('express');
const router = express.Router();
const { protect, adminOnly, farmerOnly } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getFarmerBookings,
  getAllBookings,
  updateBookingStatus,
  updateBookingProgress,
  getBooking,
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/farmer', protect, farmerOnly, getFarmerBookings);
router.get('/admin', protect, adminOnly, getAllBookings);
router.patch('/:id/status', protect, farmerOnly, updateBookingStatus);
router.patch('/:id/progress', protect, farmerOnly, updateBookingProgress);
router.get('/:id', protect, getBooking);

module.exports = router;
