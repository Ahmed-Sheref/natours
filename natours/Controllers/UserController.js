const User = require('../Models/userModel');
const JWT = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObject = (obj , ...allowFields) =>
{
    let newObject = {};
    Object.keys(obj).forEach(el =>
    {
        if (allowFields.includes(el)) newObject[el] = obj[el];
    })
    return newObject;
}

const sign = (id) =>
{
    return JWT.sign({id} , process.env.JWT_SECRET , {expiresIn:'30m'});
}

exports.getMe = (req, res, next) =>
{
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req , res , next) =>
{
    let user = await User.findById(req.user.id);
    let newReq = filterObject(req.body , 'name' , 'email');
    let newUser = await User.findByIdAndUpdate(req.user.id , newReq , {runValidators: true , new: true})

    return res.status(200).json({ status: 'success', message: "User updated successfully" , newUser});
});

/*
exports.getAllUsers = catchAsync(async (req, res, next) => 
{
    let users = await User.find();
    res.status(200).json(
    {
        status: 'success',
        users,
    });
});

exports.createUser = async (req, res) => 
{
    let users = await User.find();
    res.status(200).json(
    {
        status: 'success',
        users,
    });
};

exports.getUser = async (req, res) => 
{
    let users = await User.find();
    res.status(200).json(
    {
        status: 'success',
        users,
    });
};

exports.updateUser = catchAsync(async (req , res , next) =>
{
    let user = await User.findById(req.user.id);
    let newReq = filterObject(req.body , 'name' , 'email');
    let newUser = await User.findByIdAndUpdate(req.user.id , newReq , {runValidators: true , new: true})

    return res.status(200).json({ status: 'success', message: "User updated successfully" , newUser});
});

exports.deleteUser = (req, res) => 
{
    res.status(500).json(
    {
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
*/

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updatePassword = catchAsync(async (req, res, next) => 
{
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) 
    {
        return next(new AppError("Missing required fields", 400));
    }

    if (newPassword !== confirmPassword) 
    {
        return next(new AppError("Passwords do not match", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    const ok = await user.correct(currentPassword , user.password);
    if (!ok) 
    {
        return next(new AppError("Current password is incorrect", 401));
    }

    user.password = newPassword;
    user.confirmPassword = confirmPassword;

    await user.save();
    let token = sign(req.user.id);

    return res.status(200).json({ status: 'success', message: "Password updated successfully" , token});
});

exports.deleteMe = catchAsync(async (req , res , next) =>
{
    let user = await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(200).json({ status: 'success', message: "User deleted successfully"});
});