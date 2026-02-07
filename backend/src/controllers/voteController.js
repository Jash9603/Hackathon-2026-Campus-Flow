const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Vote = require('../models/Vote');
const Event = require('../models/Event');

// @desc    Cast a vote
// @route   POST /api/votes/:eventId
// @access  Private (Student)
const castVote = asyncHandler(async (req, res) => {
    const { targetId, value } = req.body;
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if voting module enabled
    const votingModule = event.modules.find(m => m.type === 'voting');
    if (!votingModule) {
        res.status(400);
        throw new Error('Voting is not enabled for this event');
    }

    // Check if user already voted for this target
    const existingVote = await Vote.findOne({
        event: eventId,
        user: req.user.id,
        targetId,
    });

    if (existingVote) {
        // Update vote instead of throwing error? Or allow changing vote?
        // Let's allow changing vote
        existingVote.value = value;
        await existingVote.save();
        res.status(200).json(existingVote);
    } else {
        const vote = await Vote.create({
            event: eventId,
            user: req.user.id,
            targetId,
            value,
        });
        res.status(201).json(vote);
    }
});

// @desc    Get aggregated votes for an event
// @route   GET /api/votes/event/:eventId
// @access  Public
const getEventVotes = asyncHandler(async (req, res) => {
    // Aggregate votes by targetId and value
    const votes = await Vote.aggregate([
        { $match: { event: new mongoose.Types.ObjectId(req.params.eventId) } },
        {
            $group: {
                _id: { targetId: "$targetId", value: "$value" },
                count: { $sum: 1 }
            }
        }
    ]);
    res.status(200).json(votes);
});

// @desc    Get my votes for an event
// @route   GET /api/votes/my/:eventId
// @access  Private
const getMyVotes = asyncHandler(async (req, res) => {
    const votes = await Vote.find({
        event: req.params.eventId,
        user: req.user.id
    });
    res.status(200).json(votes);
});

module.exports = {
    castVote,
    getEventVotes,
    getMyVotes,
};
