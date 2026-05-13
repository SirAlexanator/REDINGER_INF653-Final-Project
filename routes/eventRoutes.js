const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/:id', getEventById);

router.post('/', auth, admin, createEvent);
router.put('/:id', auth, admin, updateEvent);
router.delete('/:id', auth, admin, deleteEvent);
router.get('/admin/dashboard', auth, admin, async (req, res) => {
    const events = await Event.find();

    const result = await Promise.all(events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id })
            .populate('user', 'name email');

        return {
            event,
            bookings
        };
    }));

    res.json(result);
});
module.exports = router;