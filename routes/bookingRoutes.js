const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getBookings);
router.get('/:id', auth, bookingController.getBookingById);

//  QR Validation Endpoint
router.get('/validate/:qr', async (req, res) => {
    try {
        const bookingId = req.params.qr.replace('booking:', '');

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ valid: false });
        }

        res.json({ valid: true, booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;