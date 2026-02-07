require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');

async function cleanupTestEvents() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete test events
        const result = await Event.deleteMany({
            title: { $in: ['Reg Event', 'Vote Event'] }
        });

        console.log(`✅ Deleted ${result.deletedCount} test events`);

        // List remaining events
        const events = await Event.find({}).select('title');
        console.log('\nRemaining events:');
        events.forEach(e => console.log(`- ${e.title}`));

        await mongoose.disconnect();
        console.log('\n✅ Cleanup complete!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanupTestEvents();
