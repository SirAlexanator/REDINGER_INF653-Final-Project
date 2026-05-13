const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingEmail = async (to, booking) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Booking Confirmation',
        html: `
            <h2>Your Ticket is Confirmed 🎟</h2>
            <p>Booking ID: ${booking._id}</p>
            <p>Quantity: ${booking.quantity}</p>
        `
    });
};

module.exports = sendBookingEmail;