const express = require('express');
const router = express.Router();
const { main } = require('../controllers/aichat');

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI chat route is running. Send a POST request with a prompt to chat.',
  });
});

router.post('/', main);

module.exports = router;
