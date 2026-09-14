const express = require('express')
const reviewControll = require('../Controllers/reviewController')
const authcontroll = require('../Controllers/authcontroll')
const bookingController = require('../Controllers/bookingControl');

const router = express.Router();

router.get('/checkout-session/:tourId', authcontroll.protect, bookingController.getCheckoutSession)

module.exports = router