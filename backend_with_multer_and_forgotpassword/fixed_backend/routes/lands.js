const express = require('express');
const router = express.Router();
const { protect, adminOnly, farmerOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getLands,
  getLand,
  addLand,
  updateLand,
  approveLand,
  setAvailability,
  getMyLands,
  getAllLands,
} = require('../controllers/landController');

router.get('/', getLands);
router.get('/farmer/my', protect, farmerOnly, getMyLands);
router.get('/admin/all', protect, adminOnly, getAllLands);
router.get('/:id', getLand);
router.post('/', protect, farmerOnly, upload.array('images', 5), addLand);
router.put('/:id', protect, farmerOnly, upload.array('images', 5), updateLand);
router.patch('/:id/approve', protect, adminOnly, approveLand);
router.patch('/:id/availability', protect, farmerOnly, setAvailability);

module.exports = router;
