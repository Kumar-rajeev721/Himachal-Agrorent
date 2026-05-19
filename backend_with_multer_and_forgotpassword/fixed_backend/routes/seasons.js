const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getSeasons, addSeason, updateSeason, deleteSeason } = require('../controllers/seasonController');

router.get('/', getSeasons);
router.post('/', protect, adminOnly, addSeason);
router.put('/:id', protect, adminOnly, updateSeason);
router.delete('/:id', protect, adminOnly, deleteSeason);

module.exports = router;
