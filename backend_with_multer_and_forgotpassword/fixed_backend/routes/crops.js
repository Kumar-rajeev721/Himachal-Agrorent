const express = require('express');
const router = express.Router();
const { protect, adminOnly, farmerOnly } = require('../middleware/auth');
const { getCrops, addCrop, updateCrop, deleteCrop } = require('../controllers/cropController');

router.get('/', getCrops);
router.post('/', protect, farmerOnly, addCrop);
router.put('/:id', protect, farmerOnly, updateCrop);
router.delete('/:id', protect, adminOnly, deleteCrop);

module.exports = router;
