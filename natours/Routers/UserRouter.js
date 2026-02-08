const fs = require('fs');
const express = require('express');
const UserRouter = require('./../Controllers/UserController')
const authcontroll = require('./../Controllers/authcontroll')




const router = express.Router();

router.post('/signup', authcontroll.signup)
router.post('/login', authcontroll.login)

router.post('/forgetpassword', authcontroll.forget)
router.patch('/resetpassword/:token', authcontroll.resetPassword)


router.patch('/updateMyPassword' , authcontroll.protect, UserRouter.updatePassword)
router.patch('/updateMe' , authcontroll.protect, UserRouter.updateUser)
router.delete('/deleteMe' , authcontroll.protect, UserRouter.deleteMe)


router
    .route('/')
    .get(UserRouter.getAllUsers)
    .post(UserRouter.createUser);

router
    .route('/:id')
    .get(UserRouter.getUser)
    // .patch(UserRouter.updateUser)
    .delete(UserRouter.deleteUser);

module.exports = router