const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const { type } = require('os');
let userModel = new mongoose.Schema
(
    {
        name:
        {
            type: String,
            required: true,
            maxlength: [40, 'name should be less than or equal 40'],
            minlength: [10, 'name should be more than or equal 10'],
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate:
            {
                validator: validator.isEmail,
                message: 'Please Provide a valid email'
            }
        },
        photo:
        {
            type: String,
        },
        role:
        {
            type: String,
            enum: ['user' , 'admin'],
            default: 'user'
        },
        active:
        {
            type: Boolean,
            select: false,
            default: true
        },
        password:
        {
            type: String,
            required: true,
            min: 8
        },
        confirmPassword:
        {
            type: String,
            required: true,
            validate:
            {
                validator: function(value)
                {
                    return this.password === value;
                },
                message: 'Should be the same password'
            }
        },
        changePasswordAt: {type: Date},
        resetPasswordToken:
        {
            type: String
        },
        resetPasswordTokenExpire:
        {
            type: Date
        }
    }
)

userModel.pre('save' , async function(next)
{
    if (this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password , 12);
        this.confirmPassword = undefined;
        this.changePasswordAt = Date.now() - 1000;
    }
    next();
})

userModel.pre(/^find/ , function (next)
{
    this.find({active: {$ne: false}});
    next();
})

//! we pass the two parameter because password -> (select: false)
userModel.methods.correct = async function (oldPass , userPass)
{
    return await bcrypt.compare(oldPass , userPass);
}

userModel.methods.changedPasswordAfter = function (jwtIatSeconds) 
{
    if (!this.changePasswordAt) return false;

    const changedAtSeconds = Math.floor(this.changePasswordAt.getTime() / 1000);
    return changedAtSeconds > jwtIatSeconds;
};

userModel.methods.createRandomToken = function()
{
    let resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordTokenExpire = Date.now() + 10 * 1000 * 60;

    return resetToken;
}


const User = mongoose.model('User' , userModel);

module.exports = User;
