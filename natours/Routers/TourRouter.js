const fs = require('fs');
const express = require('express');
const TourRouter = require('./../Controllers/TourController')



// const tours = JSON.parse(fs.readFileSync(''));
const router = express.Router();

// router.param('id' , TourRouter.Check_id)

router.get('/:id' , TourRouter.getSpecficTour)


router
    .route('/')
    .get(TourRouter.getTours)
    .post(TourRouter.CreateTour)

module.exports = router
