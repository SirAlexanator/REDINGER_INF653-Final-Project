const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const {
    register,
    login
} = require('../controllers/authController');

router.post(
    '/register',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 })
    ],
    validate,
    register
);

router.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').exists()
    ],
    validate,
    login
);

module.exports = router;