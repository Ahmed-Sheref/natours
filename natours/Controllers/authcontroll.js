const { configDotenv } = require('dotenv');
const User = require('../Models/userModel');
const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// refresh token
// logout
// SSO

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
                role: req.body.role
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
    let correct;
    try
    {
        correct = await JWT.verify(token , process.env.JWT_SECRETE);
    }
    catch(err)
    {
        return res.status(401).json(
        {
            status: 'Not verify',
            token: '',
        })
    }

    //3) Check if user still exists
    let currentUser = await User.findById(correct.id);
    if (!currentUser) 
    {
    return res.status(401).json(
        {
            status: 'fail',
            message: 'User no longer exists',
        });
    }

    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(correct.iat))
    {
        return res.status(401).json({ message: "Password changed. Please login again." });
    }
    req.user = currentUser;
    next();
}

exports.restrictto = function(...role)
{
    const roles = role;
    return function(req ,res, next)
    {
        if (!roles.includes(req.user.role))
        {
            return res.status(403).json(
            {
                status: 'fail',
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    }
}

exports.forget = async (req, res) =>
{
    const email = req.body.email;

    // 1) get user by email
    let user = await User.findOne({email: email});
    if (!user)
    {
        return res.status(403).json(
        {
            status: 'fail',
            message: 'You do not have permission to perform this action',
        });
    }

    // 2) Generate the randomToken
    let randomToken = user.createRandomToken();
    await user.save({validateBeforeSave: false});

    console.log(randomToken);

    // 3) sent the token to user's email


    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${randomToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and
    passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this
    email!`;

    try 
    {
        await sendEmail.sendEmail(
        {
            email: user.email, 
            subject: 'Your password reset token (valid for 10 min)',
            template: 'passwordReset', 
            user: user,              
            url: resetURL            
        });

        res.status(200).json(
        {
            status: 'success',
            message: 'Token sent to email!'
        });
    } 
    catch (err) 
    {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        console.log(err)
        res.status(400).json(
        {
            status: 'fail',
            message: err.message
        });
    }
}


exports.resetPassword =  async (req , res , next) => 
{
    // 1) Get user based on the token
    let hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(hashedToken);
    let user = await User.findOne({resetPasswordToken: hashedToken});
    if (!user)
    {
        return res.status(403).json(
        {
            status: 'fail',
            message: 'Not found user',
        });
    }


    // 2) If token has not expired, and there is user, set the new password
    if (user.resetPasswordTokenExpire < Date.now())
    {
        return res.status(403).json(
        {
            status: 'fail',
            message: 'Expires',
        });
    }

    // 3) Update changedPasswordAt property for the user
    user.changePasswordAt = Date.now();
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    // 4) Log the user in, send JWT

    res.status(200).json(
    {
        status: 'success',
        token: sign(user._id)
    })
    next();
}