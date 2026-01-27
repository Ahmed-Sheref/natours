const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
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
    }
)

userModel.pre('save' , async function(next)
{
    if (this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password , 12);
        this.confirmPassword = undefined;
        this.changePasswordAt = Date.now();
    }
    next();
})

userModel.methods.correct = async function (oldPass , userPass)
{
    return await bcrypt.compare(oldPass , userPass);
}

userSchema.methods.changedPasswordAfter = function (jwtIatSeconds) 
{
    if (!this.changePasswordAt) return false;

    const changedAtSeconds = Math.floor(this.changePasswordAt.getTime() / 1000);
    return changedAtSeconds > jwtIatSeconds;
};


const User = mongoose.model('User' , userModel);

module.exports = User;
