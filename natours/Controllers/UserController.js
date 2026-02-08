// const { sign } = require('jsonwebtoken');
const User = require('../Models/userModel');
const JWT = require('jsonwebtoken');

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
    return JWT.sign({id} , process.env.JWT_SECRETE , {expiresIn:'30m'});
}

exports.getAllUsers = async (req, res) => 
{
    let users = await User.find();
    res.status(200).json({
    status: 'success',
    users,
    });
};

exports.createUser = (req, res) => 
{
    let users = User.find();
    res.status(200).json({
    status: 'success',
    users,
    });
};

exports.getUser = (req, res) => 
{
    let users = User.find();
    res.status(200).json({
    status: 'success',
    users,
    });
};

exports.updatePassword = async (req, res) => 
{

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) 
    {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(req.user.id).select("+password");

    const ok = await user.correct(currentPassword , user.password);
    if (!ok) 
    {
        return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    user.confirmPassword = confirmPassword;

    await user.save();
    let token = sign(req.user.id);


    return res.status(200).json({ message: "Password updated successfully" , token});
}

exports.updateUser = async (req , res , next) =>
{
    let user = await User.findById(req.user.id);
    let newReq = filterObject(req.body , 'name' , 'email');
    let newUser = await User.findByIdAndUpdate(req.user.id , newReq , {runValidators: true , new: true})

    return res.status(200).json({ message: "User updated successfully" , newUser});
}

exports.deleteMe = async (req , res , next) =>
{
    let user = await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(200).json({ message: "User deleted successfully"});
}

exports.deleteUser = (req, res) => 
    {
    res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
    });
};