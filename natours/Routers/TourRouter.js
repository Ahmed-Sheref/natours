const fs = require('fs');
const express = require('express');
const TourRouter = require('./../Controllers/TourController');
const authcontroll = require('./../Controllers/authcontroll');
// const { route } = require('..');



// const tours = JSON.parse(fs.readFileSync(''));
const router = express.Router();

// router.param('id' , TourRouter.Check_id)

// router
//     .route('/top-5-cheep')
//     .get(TourRouter.getTop_5_cheep , TourRouter.getTours)
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

module.exports = router
