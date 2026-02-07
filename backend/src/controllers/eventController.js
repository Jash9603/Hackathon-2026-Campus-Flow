const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const { status, category, date } = req.query;
    const filter = {};

    if (status) {
        filter.status = status;
    } else {
        // Default to showing only published and ongoing for public feed if no status requested?
        // Or let frontend decide. For now, let's return all if no status specified, 
        // but usually public feed shouldn't show drafts.
        // Let's assume query param or default to non-draft/archived if public.
        // But for simplicity, I'll return all and let frontend filter, OR support direct filter.
    }

    if (date) {
        // Filter by date (e.g. events starting after this date)
        filter['timeline.start'] = { $gte: new Date(date) };
    }

    const events = await Event.find(filter).populate('organizer', 'name email').sort({ 'timeline.start': 1 }); // Sort by upcoming
    res.status(200).json(events);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    res.status(200).json(event);
});

// @desc    Get logged in organizer's events
// @route   GET /api/events/my
// @access  Private (Organizer)
const getMyEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ organizer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(events);
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, timeline, location, themeConfig, modules } = req.body;

    if (!title || !description || !timeline || !location) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const event = await Event.create({
        organizer: req.user.id,
        title,
        description,
        timeline,
        location,
        themeConfig,
        modules,
    });

    const io = req.app.get('socketio');
    if (io) {
        io.emit('new_event', event);
    }

    res.status(201).json(event);
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check user is organizer of this event or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized to update this event');
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedEvent);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check user is organizer of this event or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized to delete this event');
    }

    await event.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getEvents,
    getMyEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
};
