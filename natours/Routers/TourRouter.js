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

/**
 * @openapi
 * /api/v1/tours/get-tours-stats:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get tours statistics (grouped by difficulty)
 *     responses:
 *       200:
 *         description: Stats
 */

/**
 * @openapi
 * /api/v1/tours/monthly_plan/{year}:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get monthly plan for a given year
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Monthly plan
 */

/**
 * @openapi
 * /api/v1/tours/{id}:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get specific tour by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Tour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 */

/**
 * @openapi
 * /api/v1/tours/{id}:
 *   patch:
 *     tags:
 *       - Tours
 *     summary: Update tour by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: Updated tour
 */

/**
 * @openapi
 * /api/v1/tours/{id}:
 *   delete:
 *     tags:
 *       - Tours
 *     summary: Delete tour by id (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Deleted tour
 */

/**
 * @openapi
 * /api/v1/tours:
 *   get:
 *     tags:
 *       - Tours
 *     summary: Get all tours (supports filtering, sorting, pagination)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Example: price,-ratingsAverage
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of tours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 len:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     tours:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tour'
 */

/**
 * @openapi
 * /api/v1/tours:
 *   post:
 *     tags:
 *       - Tours
 *     summary: Create a new tour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: Created tour
 */



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
