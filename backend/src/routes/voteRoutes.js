const express = require('express');
const router = express.Router();
const {
    castVote,
    getEventVotes,
    getMyVotes,
} = require('../controllers/voteController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:eventId', protect, castVote);
router.get('/event/:eventId', getEventVotes);
router.get('/my/:eventId', protect, getMyVotes);

module.exports = router;
