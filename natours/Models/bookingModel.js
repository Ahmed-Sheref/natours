const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
{
    tour: 
    {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },

    user: 
    {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    price: 
    {
        type: Number,
        required: true
    },

    currency: 
    {
        type: String,
        default: 'usd'
    },

    paid: 
    {
        type: Boolean,
        default: false
    },

    stripeSessionId: 
    {
        type: String,
        required: true,
        unique: true
    },

    stripePaymentIntentId: 
    {
        type: String
    }
},
    {
        timestamps: true
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;