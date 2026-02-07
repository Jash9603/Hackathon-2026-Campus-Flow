const express = require('express');
const router = express.Router();
const {
    registerForEvent,
    getMyRegistrations,
    getEventRegistrations,
    updateRegistrationStatus,
} = require('../controllers/registrationController');
const { protect, organizer } = require('../middlewares/authMiddleware');

router.post('/:eventId', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/event/:eventId', protect, organizer, getEventRegistrations);
router.put('/:id', protect, organizer, updateRegistrationStatus);

module.exports = router;
