const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add an event title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'ongoing', 'archived'],
            default: 'draft',
        },
        timeline: {
            start: {
                type: Date,
                required: [true, 'Please add a start date'],
            },
            end: {
                type: Date,
                required: [true, 'Please add an end date'],
            },
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        // Theme configuration for Frontend (Colors, Fonts, bgImage, etc.)
        themeConfig: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        // Array of active modules for this event
        modules: [
            {
                type: {
                    type: String, // e.g., 'registration', 'polls', 'teams'
                    required: true
                },
                config: {
                    type: mongoose.Schema.Types.Mixed,
                    default: {}
                }
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Event', eventSchema);
