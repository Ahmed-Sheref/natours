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
    .route('/:id')
    .get(TourRouter.getSpecficTour)
    .patch(TourRouter.UpdateTour)
    .delete(authcontroll.protect, authcontroll.restrictto('admin'), TourRouter.DeleteTour);

router
    .route('/')
    .get(authcontroll.protect ,TourRouter.getTours)
    .post(TourRouter.CreateTour);

router.use('/:tour/review', reviewRouter)

module.exports = router
