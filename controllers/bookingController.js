const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');
const sendEmail = require('../utils/email');

exports.createBooking = async (req, res, next) => {
    try {
        const { event, quantity } = req.body;

        if (!event || !quantity) {
            return res.status(400).json({ error: 'Event and quantity required' });
        }

        const qty = Number(quantity);

        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        const foundEvent = await Event.findById(event);

        if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        //  HARD SAFETY CHECK
        const booked = Number(foundEvent.bookedSeats || 0);
        const capacity = Number(foundEvent.seatCapacity || 0);

        const remaining = capacity - booked;

        if (qty > remaining) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // update safely
        foundEvent.bookedSeats = booked + qty;
        await foundEvent.save();

        const booking = await Booking.create({
            user: req.user.id,
            event,
            quantity: qty
        });

        const qrCode = await QRCode.toDataURL(`booking:${booking._id}`);

        booking.qrCode = qrCode;
        await booking.save();

        const user = await User.findById(req.user.id);
console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS LENGTH:", process.env.EMAIL_PASS?.length);
        if (user?.email) {
            await sendEmail(
                user.email,
                'Booking Confirmation',
                `Booking confirmed. ID: ${booking._id}`
            );
        }

        res.status(201).json({
            message: 'Booking successful',
            booking,
            qrCode
        });

    } catch (err) {
        next(err);
    }
};