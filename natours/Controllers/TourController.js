// const fs = require('fs')
const Tour = require('./../Models/tourModel.js');
const catchAsync = require('../utils/catchAsync.js');
const appError = require('../utils/appError.js');
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
    
        const s_tours = await Tour.findById(req.params.id);
        res.status(200).json(
        {
            status : 'success',
            data : {s_tours}
        })
})



exports.CreateTour = catchAsync(async (req , res, next) =>
{
    // try
    // {
        const newTour = await Tour.create(req.body);
        res.status(200).json(
            {
                status: 'success',
                data : {tour : newTour}
            }
        )
    // }
    // catch (err)
    // {
    //     res.status(400).json(
    //         {
    //             status : 'fail',
    //             message : err
    //         }
    //     )
    // }
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
    
    
        // res.status(400).json(
        // {
        //     status: 'fail',
        //     message: `Invalid ID: ${err.message}`
        // });
    
})

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