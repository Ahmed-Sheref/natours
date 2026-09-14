const express = require('express');
const cors = require('cors');

const TourRouter = require('./Routers/TourRouter');
const UserRouter = require('./Routers/UserRouter');
const ReviewRouter = require('./Routers/ReviewRouter');
const bookingRouter = require('./Routers/bookingRouter');

const bookingController = require('./Controllers/bookingControl');

const appError = require('./utils/appError');
const errorHandler = require('./Controllers/errorController');

const path = require('path');

const app = express();


// CORS
app.use(cors({origin: process.env.FRONTEND_URL}));


// STRIPE WEBHOOK
// MUST be before express.json()
app.post('/api/v1/booking/webhook',express.raw({type: 'application/json'}),bookingController.webhookCheckout);


// Normal JSON body parser
app.use(express.json({limit: '10kb'}));


app.use(express.static(path.join(__dirname, 'public')));


// Routers
app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/reviews', ReviewRouter);
app.use('/api/v1/booking', bookingRouter);


app.use((req, res, next) => {next(new appError('Path Not Found', 404));});


app.use(errorHandler);

module.exports = app;