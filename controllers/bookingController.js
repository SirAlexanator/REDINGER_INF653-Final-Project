const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.createBooking = async (req, res) => {
    const { event, quantity } = req.body;

    const foundEvent = await Event.findById(event);

    const availableSeats = foundEvent.seatCapacity - foundEvent.bookedSeats;

    if (quantity > availableSeats) {
        return res.status(400).json({ error: 'Not enough seats' });
    }

    foundEvent.bookedSeats += quantity;
    await foundEvent.save();

    const booking = new Booking({
        user: req.user.id,
        event,
        quantity
    });

    await booking.save();
    res.json(booking);
};

exports.getBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.json(bookings);
};

exports.getBookingById = async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(booking);
};