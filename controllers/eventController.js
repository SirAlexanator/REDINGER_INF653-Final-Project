const Event = require('../models/Event');

exports.getEvents = async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.category) filter.category = req.query.category;

        if (req.query.date) {
            const date = new Date(req.query.date);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            filter.date = { $gte: date, $lt: nextDay };
        }

        const events = await Event.find(filter);
        res.json(events);
    } catch (err) {
        next(err);
    }
};

exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        res.json(event);
    } catch (err) {
        next(err);
    }
};

exports.createEvent = async (req, res, next) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        next(err);
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (req.body.seatCapacity < event.bookedSeats) {
            return res.status(400).json({ error: 'Cannot reduce below booked seats' });
        }

        Object.assign(event, req.body);
        await event.save();

        res.json(event);
    } catch (err) {
        next(err);
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (event.bookedSeats > 0) {
            return res.status(400).json({ error: 'Cannot delete event with bookings' });
        }

        await event.deleteOne();
        res.json({ message: 'Deleted' });
    } catch (err) {
        next(err);
    }
};