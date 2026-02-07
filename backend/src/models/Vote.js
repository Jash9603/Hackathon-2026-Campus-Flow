const mongoose = require('mongoose');

const voteSchema = mongoose.Schema(
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
        // The specific poll/item being voted on
        targetId: {
            type: String,
            required: true,
        },
        // The value of the vote (e.g., option index, 'yes'/'no', rating)
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent multiple votes for same target by same user
voteSchema.index({ event: 1, user: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
