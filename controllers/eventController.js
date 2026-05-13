const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.date) {
        const date = new Date(req.query.date);
        filter.date = {
            $gte: date,
            $lt: new Date(date.setDate(date.getDate() + 1))
        };
    }

    const events = await Event.find(filter);
    res.json(events);
};

exports.getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id);
    res.json(event);
};

exports.createEvent = async (req, res) => {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
};

exports.updateEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (req.body.seatCapacity < event.bookedSeats) {
        return res.status(400).json({ error: 'Cannot reduce below booked seats' });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
};

exports.deleteEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event.bookedSeats > 0) {
        return res.status(400).json({ error: 'Cannot delete event with bookings' });
    }

    await event.deleteOne();
    res.json({ message: 'Deleted' });
};