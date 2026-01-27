const { configDotenv } = require('dotenv');
const User = require('../Models/userModel');
const JWT = require('jsonwebtoken');
const { promisify } = require('util');


const sign = (id) =>
{
    return JWT.sign({id} , process.env.JWT_SECRETE , {expiresIn:'30m'});
}

exports.signup = async (req, res, next) =>
{
    try
    {
        let newUser = await User.create
        (
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
            }
        );
        // const token = JWT.sign({id: newUser._id} , process.env.JWT_SECRETE , {expiresIn:'30m'});
        const token = sign(newUser._id);
        res.status(201).json(
            {
                status: 'success',
                token,
                data:
                {
                    user: newUser
                }
            }
        )
    }
    catch (err)
    {
        res.status(400).json(
            {
                status: 'faild',
                err
            }
        )
    }
}

exports.login = async (req , res , next) => 
{
    const {email , password} = req.body;
    if (!email || !password)
    {
        return res.status(401).json(
            {
                status: 'fail',
                token: ''
            })
    }
    let user = await User.findOne({email}).select('+password');
    if (!user)
    {
        return res.status(401).json(
        {
            status: 'fail',
            token: ''
        })
    }
    let correct = await user.correct(password , user.password);
    if (!correct)
    {
        return res.status(401).json(
        {
            status: 'fail',
            token: ''
        })
    }
    res.status(200).json(
        {
            status: 'success',
            token: sign(user._id)
        }
    )
}

exports.protect = async (req , res , next) =>
{
    //1) Getting token and checking if it's there
    let token;
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer')
    {
        return res.status(401).json(
        {
            status: 'fail',
            token: ''
        })
    }
    else
    {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    // next();

    //2) Verification of token
    let correct = await promisify(JWT.verify)(token , proccess.env.JWT_SECRETE);
    if (!correct)
    {
        return res.status(401).json(
        {
            status: 'Not verify',
            token: ''
        })
    }

    //3) Check if user still exists
    let currentUser = User.findById(correct.id);
    if (!currentUser) 
    {
    return res.status(401).json(
        {
            status: 'fail',
            message: 'User no longer exists'
        });
    }

    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(correct.iat)) 
    {
        return res.status(401).json({ message: "Password changed. Please login again." });
    }
}