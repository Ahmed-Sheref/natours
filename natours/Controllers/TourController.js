// const fs = require('fs')
const Tour = require('./../Models/tourModel.js');
const catchAsync = require('../utils/catchAsync.js');
const appError = require('../utils/appError.js');
const factory = require('./handlerFactory');

/* 
class API_Features 
{
    constructor(Query , queryStr)
    {
        this.Query = Query;
        this.queryStr = queryStr;
    }

    filter()
    {
        let queryObj = {...this.queryStr};
        
        let Special_Operation = ['sort' , 'limit' , 'page' , 'fields']
        
        Special_Operation.forEach(op => {delete queryObj[op]});
        console.log(queryObj);

        // Handle query to match specific syntax for Mongooes
        queryObj = JSON.stringify(queryObj);
        let queryStr = queryObj.replace(/"(\w+)\[(gte|gt|lte|lt)\]":"?([^"]+)"?/g,'"$1":{"$$$2":"$3"}');
        queryStr = JSON.parse(queryStr);
        this.Query = this.Query.find(queryStr);
        return this;
    }

    sort()
    {
        let QuerySort = this.queryStr.sort;
        if (QuerySort)
        {
            console.log('before =', QuerySort);
            QuerySort = QuerySort.split(',').join(' ');
            console.log('after  =', QuerySort);
            this.Query = this.Query.sort(QuerySort);
        }
        return this;
    }

    limit()
    {
        let Querylimit = this.queryStr.limit ? this.queryStr.limit * 1 : 10;
        let Querypage  = this.queryStr.page  ? this.queryStr.page  * 1 : 1;

        let Queryskip = (Querypage - 1) * Querylimit;

        this.Query = this.Query.skip(Queryskip).limit(Querylimit);
        return this;
    }
}
*/

/*
exports.getTours = catchAsync (async (req , res, next) => 
{
        let Features = new API_Features(Tour.find() , req.query)
        .filter()
        .sort()
        .limit();

        // Run Query
        const tours = await Features.Query;
        res.status(200).json(
        {
            len : tours.length,
            status : 'success',
            data : {tours}
        })
})

exports.getSpecficTour = catchAsync (async (req , res, next) => 
{
    
        const s_tours = await Tour.findById(req.params.id).populate('reviews');
        res.status(200).json(
        {
            status : 'success',
            data : {s_tours}
        })
})

exports.CreateTour = catchAsync(async (req , res, next) =>
{
        const newTour = await Tour.create(req.body);
        res.status(200).json(
            {
                status: 'success',
                data : {tour : newTour}
            }
        )
})

exports.UpdateTour = catchAsync(async (req , res, next) =>
{
        const newTour = await Tour.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true});
        res.status(200).json(
            {
                status: 'success',
                data : {tour : newTour}
            }
        )
})

exports.DeleteTour = catchAsync(async (req , res, next) =>
{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour)
        {
            return next(new appError('this tour not found', 404));
        }
        res.status(200).json(
        {
            status: 'success',
            data: tour
        });
})
*/

exports.getTours = factory.getAll(Tour);
exports.getSpecficTour = factory.getOne(Tour, { path: 'reviews' });
exports.CreateTour = factory.createOne(Tour);
exports.UpdateTour = factory.updateOne(Tour);
exports.DeleteTour = factory.deleteOne(Tour);

exports.get_Tours_stats = catchAsync(async (req , res, next) =>
{
    
        let Tours = await Tour.aggregate(
            [
                {
                    '$group' : 
                    {
                        _id : '$difficulty',
                        numtours : {'$sum' : 1},
                        avgPrice: {'$avg': '$price'},
                    }
                }
                ,
                {
                    '$sort' : 
                    {
                        'avgPrice' : -1
                    }
                }
            ]
        )

        res.status(200).json(
            {
                status : 'success',
                data: Tours
            }
        )
    
})

exports.get_plan_monthly = catchAsync(async (req , res, next) =>
{
        let year = req.params.year;
        let Tours = await Tour.aggregate(
            [
                {
                    '$unwind' : '$startDates'
                },
                {
                    '$match' : 
                    {
                        startDates : 
                        {
                            '$gte' : new Date(`${year}-01-01`),
                            '$lte' : new Date(`${year}-12-31`)
                        }
                    }
                }
                ,
                {
                    '$group' : 
                    {
                        _id : {'$month' : '$startDates'},
                        numOfTours : {'$sum' : 1},
                        Tours : {'$push' : '$name'}
                    }
                }
                ,
                {
                    '$project' :
                    {
                        _id: 0,
                        month: "$_id",
                        numOfTours: 1,
                        Tours: 1
                    }
                }
            ]
        )

        res.status(200).json(
            {
                len : Tours.length,
                status : 'success',
                data: Tours
            }
        )
})

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => 
{
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) 
    {
        next(new appError('Please provide latitutr and longitude in the format lat,lng.',400));
        return;
    }

    const tours = await Tour.find({startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }});

    res.status(200).json(
    {
        status: 'success',
        results: tours.length,
        data: { data: tours }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => 
{
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) 
    {
        next(new appError('Please provide latitutr and longitude in the format lat,lng.',400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: 
            {
                near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        { $project: { distance: 1, name: 1 } }
    ]);

    res.status(200).json({ status: 'success', data: { data: distances } });
});