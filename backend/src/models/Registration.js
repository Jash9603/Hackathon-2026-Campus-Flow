const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Event',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'waitlisted', 'rejected'],
            default: 'pending',
        },
        // Dynamic responses based on event registration form config
        responses: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate registrations
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
