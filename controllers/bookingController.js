const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.createBooking = async (req, res, next) => {
    try {
        const { event, quantity } = req.body;

        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: event,
                $expr: {
                    $gte: [
                        { $subtract: ['$seatCapacity', '$bookedSeats'] },
                        quantity
                    ]
                }
            },
            { $inc: { bookedSeats: quantity } },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(400).json({ error: 'Not enough seats' });
        }

        const booking = new Booking({
            user: req.user.id,
            event,
            quantity
        });

        await booking.save();
        res.status(201).json(booking);

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

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(booking);
    } catch (err) {
        next(err);
    }
};