const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');
const sendEmail = require('../utils/email');

exports.createBooking = async (req, res, next) => {
    try {
        const { event, quantity } = req.body;

        if (!event || !quantity) {
            return res.status(400).json({ error: 'Event and quantity are required' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        // Get event safely
        const foundEvent = await Event.findById(event);

        if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Ensure bookedSeats is NEVER undefined
        if (foundEvent.bookedSeats == null) {
            foundEvent.bookedSeats = 0;
        }

        const availableSeats = foundEvent.seatCapacity - foundEvent.bookedSeats;

        if (quantity > availableSeats) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // Update seats safely
        foundEvent.bookedSeats += quantity;
        await foundEvent.save();

        // Create booking
        const booking = new Booking({
            user: req.user.id,
            event,
            quantity
        });

        await booking.save();

        // Generate QR code
        const qrData = `booking:${booking._id}`;

        const qrCode = await QRCode.toDataURL(qrData);

        booking.qrCode = qrCode;
        await booking.save();

        // Send email
        const user = await User.findById(req.user.id);

        if (user && user.email) {
            await sendEmail(
                user.email,
                'Booking Confirmation',
                `Your booking is confirmed.\nBooking ID: ${booking._id}\nQuantity: ${quantity}`
            );
        }

        return res.status(201).json({
            message: 'Booking successful',
            booking,
            qrCode
        });

    } catch (err) {
        next(err);
    }
};

exports.getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('event');
        res.json(bookings);
    } catch (err) {
        next(err);
    }
};

exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('event');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(booking);
    } catch (err) {
        next(err);
    }
};