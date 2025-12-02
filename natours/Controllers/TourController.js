const fs = require('fs')
const Tour = require('./../Models/tourModel.js');

// const tours = JSON.parse(fs.readFileSync('D:\\Programming\\Back_end\\Jonas\\natours\\dev-data\\data\\tours-simple.json'));

// exports.Check_id = (req , res , next , val) => 
// {
//     console.log(val);
//     if (req.params.id * 1 > tours.length)
//     {
//         return res.status(404).json(
//         {
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// }


// exports.Check_New_Tour = (req , res , next) =>
// {
//     const body = req.body;
//     console.log(body);
//     if (!Object.hasOwn(body, 'name') || !(Object.hasOwn(body, 'price')) ) 
//     {
//         return res.status(400).json(
//         {
//             status: 'fail',
//             message: 'Bad Req'
//         });
//     }
//     next();
// }

exports.getTours = async (req , res) => 
{
    try
    {
        const tours = await Tour.find();
        res.status(200).json(
        {
            status : 'success',
            data : {tours}
        })
    }
    catch
    {
        res.status(400).json(
        {
            status : 'fail',
            message : 'Invalid data'
        })
    }
    // res.status(200).json(
    // {
    //     // status : 'success' ,
    //     // data : {tours}
    // })
}

exports.getSpecficTour = async (req , res) => 
{
    // const param = req.params;
    // console.log(param);
    // const id = param.id * 1;
    // const tour = tours.find(el => el.id === id);
    // res.status(200).json(
    // {
    //     status : 'success' ,
    //     data : {tour}
    // })

    try
    {
        const s_tours = await Tour.findById(req.params.id);
        res.status(200).json(
        {
            status : 'success',
            data : {s_tours}
        })
    }
    catch
    {
        res.status(400).json(
        {
            status : 'fail',
            message : 'Invalid data'
        })
    }
}

exports.CreateTour = async (req , res) =>
{
    try
    {
        const newTour = await Tour.create(req.body);
        res.status(200).json(
            {
                status: 'success',
                data : {tour : newTour}
            }
        )
    }
    catch (err)
    {
        res.status(400).json(
            {
                status : 'fail',
                message : 'Invalid data'
            }
        )
    }
}

exports.UpdateTour = async (req , res) =>
{
    try
    {
        const newTour = await Tour.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true});
        res.status(200).json(
            {
                status: 'success',
                data : {tour : newTour}
            }
        )
    }
    catch (err)
    {
        res.status(400).json(
            {
                status : 'fail',
                message : `Invalid data ${err.message}`
            }
        )
    }
}

exports.DeleteTour = async (req , res) =>
{
    try
    {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json(
        {
            status: 'success',
            data: tour
        });
    }
    catch (err)
    {
        res.status(400).json(
        {
            status: 'fail',
            message: `Invalid ID: ${err.message}`
        });
    }
}