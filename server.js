require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes.js'));

// Root route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Event Ticketing API</h1>');
});

// 404 Middleware
app.use((req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
        res.status(404).send('<h1>404 Not Found</h1>');
    } else {
        res.status(404).json({ error: '404 Not Found' });
    }
});

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

const connectDB = require('./config/db');

connectDB();

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);