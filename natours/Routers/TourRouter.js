const fs = require('fs');
const express = require('express');
const TourRouter = require('./../Controllers/TourController');
const authcontroll = require('./../Controllers/authcontroll');
const reviewControll = require('./../Controllers/reviewController');
const reviewRouter = require('./../Routers/ReviewRouter');
// const { route } = require('..');



// const tours = JSON.parse(fs.readFileSync(''));
const router = express.Router();

router
    .route('/get-tours-stats')
    .get(TourRouter.get_Tours_stats);

router
    .route('/monthly_plan/:year')
    .get(TourRouter.get_plan_monthly);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(TourRouter.getToursWithin);


    router.route('/distances/:latlng/unit/:unit').get(TourRouter.getDistances);

router
    .route('/:id')
    .get(TourRouter.getSpecficTour)
    .patch(authcontroll.protect, TourRouter.uploadTourImages ,TourRouter.resizeTourImages, TourRouter.UpdateTour)
    .delete(authcontroll.protect, authcontroll.restrictto('admin'), TourRouter.DeleteTour);

router
    .route('/')
    .get(TourRouter.getTours)
    .post(authcontroll.protect, TourRouter.CreateTour);

router.use('/:tour/review', reviewRouter)

module.exports = router
