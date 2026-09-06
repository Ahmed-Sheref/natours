const express = require('express')
const reviewControll = require('../Controllers/reviewController')
const authcontroll = require('../Controllers/authcontroll')

const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(reviewControll.getAllReviews)
    .post(
        authcontroll.protect, 
        authcontroll.restrictto('user'), 
        reviewControll.setTourUserIds, 
        reviewControll.createReview
    );

router
    .route('/:id')
    .get(reviewControll.getReview)
    .patch(authcontroll.protect, authcontroll.restrictto('user', 'admin'), reviewControll.updateReview)
    .delete(authcontroll.protect, authcontroll.restrictto('user', 'admin'), reviewControll.deleteReview);

module.exports = router