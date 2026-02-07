require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const ADMIN_EMAIL = 'admin@campus.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Campus Admin';

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: ADMIN_EMAIL });

        if (adminExists) {
            console.log('✅ Admin account already exists');
            console.log(`Email: ${ADMIN_EMAIL}`);
            await mongoose.disconnect();
            return;
        }

        // Create admin account
        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
        });

        console.log('✅ Admin account created successfully!');
        console.log('\n📧 Admin Credentials:');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log('\n⚠️  IMPORTANT: Change these credentials in production!\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
