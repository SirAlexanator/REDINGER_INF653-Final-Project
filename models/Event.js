const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: String,
    venue: String,
    date: { type: Date, required: true },
    time: String,
    seatCapacity: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Event', eventSchema);