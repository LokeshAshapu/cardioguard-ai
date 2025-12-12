const express = require('express');
const router = express.Router();
const { predictRisk, getHistory } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, predictRisk);
router.get('/history', protect, getHistory);

module.exports = router;
