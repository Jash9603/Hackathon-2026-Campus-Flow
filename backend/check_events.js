require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');
const connectDB = require('./src/config/db');

const checkEvents = async () => {
    await connectDB();

    // Check all events
    const allEvents = await Event.find({});
    console.log(`Total Events: ${allEvents.length}`);
    allEvents.forEach(e => {
        console.log(`- [${e.status}] ${e.title} (End: ${e.timeline.end})`);
    });

    // Check query used by AI
    const aiEvents = await Event.find({
        status: { $in: ['published', 'ongoing'] }
    });
    console.log(`\nEvents visible to AI: ${aiEvents.length}`);

    process.exit();
};

checkEvents();
