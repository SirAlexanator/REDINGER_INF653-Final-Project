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

module.exports = router;