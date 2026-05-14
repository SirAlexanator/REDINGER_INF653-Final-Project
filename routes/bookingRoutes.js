const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getBookings);
router.get('/:id', auth, bookingController.getBookingById);

module.exports = router;