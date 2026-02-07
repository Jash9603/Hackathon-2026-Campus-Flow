const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[Ad-hoc Notification] To: ${to} | Subject: ${subject} | Body: ${text}`);
        console.log('NOTE: Real email not sent. Configure EMAIL_USER and EMAIL_PASS in .env to enable.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or configure host/port manually if needed
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: `[Campus Flow] ${subject}`,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
