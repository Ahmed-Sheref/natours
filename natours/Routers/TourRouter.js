const fs = require('fs');
const express = require('express');
const TourRouter = require('./../Controllers/TourController')



// const tours = JSON.parse(fs.readFileSync(''));
const router = express.Router();

// router.param('id' , TourRouter.Check_id)

router.route('/:id').get(TourRouter.getSpecficTour).patch(TourRouter.UpdateTour).delete(TourRouter.DeleteTour)


router
    .route('/')
    .get(TourRouter.getTours)
    .post(TourRouter.CreateTour)

module.exports = router
