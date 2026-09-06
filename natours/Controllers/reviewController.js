const Review = require('./../Models/reviewModel.js');
const catchAsync = require('../utils/catchAsync.js');
const appError = require('../utils/appError.js');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) =>
{
    if (!req.body.tour) req.body.tour = req.params.tour;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

/*
const getAllReviews = catchAsync(async (req, res, next) => 
{
    let Reviews = await Review.find();
    res.status(200).json(
    {
        status: 'success',
        Reviews
    })
})

const createReview = catchAsync(async (req, res, next) => 
{
    if (!req.body.tour) req.body.tour = req.params.tour;
    if (!req.body.user) req.body.user = req.params.user;
    let newReview = await Review.create(req.body);
    res.status(201).json(
    {
        status: 'success',
        newReview
    })
})

module.exports = {getAllReviews, createReview};
*/

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);