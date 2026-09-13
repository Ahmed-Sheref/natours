const fs = require('fs');
const express = require('express');
const UserRouter = require('./../Controllers/UserController')
const authcontroll = require('./../Controllers/authcontroll')
// const uploadUserPhoto = require('./../Controllers/UserController')

const router = express.Router();

router.post('/signup', authcontroll.signup)
router.post('/login', authcontroll.login)

router.post('/forgetPassword', authcontroll.forget)
router.patch('/resetPassword/:token', authcontroll.resetPassword)


router.patch('/updateMyPassword' , authcontroll.protect, UserRouter.updatePassword)
router.patch('/updateMe' ,authcontroll.protect, UserRouter.uploadUserPhoto,UserRouter.resizeUserPhoto, UserRouter.updateMe)
router.delete('/deleteMe' , authcontroll.protect, UserRouter.deleteMe)

router.get('/me', authcontroll.protect, UserRouter.getMe, UserRouter.getUser)

router
    .route('/')
    .get(UserRouter.getAllUsers)
    .post(UserRouter.createUser);

router
    .route('/:id')
    .get(UserRouter.getUser)
    .patch(UserRouter.updateUser)
    .delete(UserRouter.deleteUser);

module.exports = router