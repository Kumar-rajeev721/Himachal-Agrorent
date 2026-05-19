const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/key', protect, getRazorpayKey);

module.exports = router;
