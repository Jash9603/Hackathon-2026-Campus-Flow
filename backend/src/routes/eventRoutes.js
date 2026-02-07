const express = require('express');
const router = express.Router();
const {
    getEvents,
    getMyEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect, organizer } = require('../middlewares/authMiddleware');

router.get('/', getEvents);
router.get('/my', protect, organizer, getMyEvents);
router.get('/:id', getEvent);
router.post('/', protect, organizer, createEvent);
router.put('/:id', protect, organizer, updateEvent);
router.delete('/:id', protect, organizer, deleteEvent);

module.exports = router;
