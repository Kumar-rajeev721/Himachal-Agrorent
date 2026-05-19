const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, getFarmers, toggleUser, updateProfile } = require('../controllers/userController');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/farmers', protect, getFarmers);
router.patch('/:id/toggle', protect, adminOnly, toggleUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
