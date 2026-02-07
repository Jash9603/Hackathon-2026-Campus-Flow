const asyncHandler = require('express-async-handler');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private (Student)
const registerForEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if registration module is enabled
    const regModule = event.modules.find(m => m.type === 'registration');
    if (!regModule) {
        res.status(400);
        throw new Error('Registration is not enabled for this event');
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
        event: eventId,
        user: req.user.id,
    });

    if (existingReg) {
        res.status(400);
        throw new Error('You are already registered for this event');
    }

    // Check limits (if configured)
    if (regModule.config.limit) {
        const count = await Registration.countDocuments({ event: eventId });
        if (count >= regModule.config.limit) {
            res.status(400);
            throw new Error('Event registration is full');
        }
    }

    const registration = await Registration.create({
        event: eventId,
        user: req.user.id,
        responses: req.body?.responses || {}, // Dynamic form data (safe access)
        status: 'pending' // Or 'confirmed' based on config
    });

    res.status(201).json(registration);
});

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private (Student)
const getMyRegistrations = asyncHandler(async (req, res) => {
    const registrations = await Registration.find({ user: req.user.id })
        .populate('event', 'title timeline location status');
    res.status(200).json(registrations);
});

// @desc    Get event registrations
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer)
const getEventRegistrations = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check authorization
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to view registrations for this event');
    }

    const registrations = await Registration.find({ event: req.params.eventId })
        .populate('user', 'name email profile');

    res.status(200).json(registrations);
});

// @desc    Update registration status
// @route   PUT /api/registrations/:id
// @access  Private (Organizer)
const updateRegistrationStatus = asyncHandler(async (req, res) => {
    const registration = await Registration.findById(req.params.id).populate('event');

    if (!registration) {
        res.status(404);
        throw new Error('Registration not found');
    }

    const event = registration.event;
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    const { status } = req.body;
    if (!['pending', 'confirmed', 'waitlisted', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    const oldStatus = registration.status;
    registration.status = status;
    await registration.save();

    // Populate user to get email for notification
    await registration.populate('user', 'name email');

    // Notify user via Socket.io
    const io = req.app.get('socketio');
    if (io) {
        io.to(registration.user._id.toString()).emit('registration_update', {
            id: registration._id,
            status: status,
            event: event.title
        });
    }

    // Send Email Notification
    if (status !== oldStatus) {
        const subject = `Registration Update: ${event.title}`;
        let message = `Hello ${registration.user.name},\n\nYour registration status for "${event.title}" has been updated to: ${status.toUpperCase()}.\n\n`;

        if (status === 'confirmed') {
            message += `Congratulations! We look forward to seeing you at the event.\n\nDate: ${new Date(event.timeline.start).toLocaleString()}\nLocation: ${event.location}`;
        } else if (status === 'rejected') {
            message += `We appreciate your interest, but unfortunately we are unable to accept your registration at this time.\n\nBest regards,\nCampus Flow Team`;
        }

        // Send email (async, don't await/block response)
        const sendEmail = require('../utils/emailService');
        sendEmail(registration.user.email, subject, message);
    }

    res.status(200).json(registration);
});

module.exports = {
    registerForEvent,
    getMyRegistrations,
    getEventRegistrations,
    updateRegistrationStatus,
};
