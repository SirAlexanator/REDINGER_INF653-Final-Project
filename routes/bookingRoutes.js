const router = require('express').Router();
const auth = require('../middleware/authMiddleware');

const {
    createBooking,
    getBookings,
    getBookingById
} = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/', auth, getBookings);
router.get('/:id', auth, getBookingById);
router.get('/validate/:qr', async (req, res) => {
    try {
        const bookings = await Booking.find();

        const match = bookings.find(b => b.qrCode === req.params.qr);

        if (!match) {
            return res.status(404).json({ error: 'Invalid ticket' });
        }

        res.json({
            valid: true,
            booking: match
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;