const express = require('express');
const router = express.Router();
const User = require('../module/userSchema')
const userModel = require('../module/userSchema');

const jwt = require("jsonwebtoken");
const isLoggedIn = require('../middleware/jwt');
const catchAsyncError = require('../middleware/catchAsyncError');


router.post('/register', catchAsyncError(async function (req, res, next) {
    try {
        const { username, password, contact } = req.body;


        if (!username || !password || !contact) {
            return next(new ErrorHandler("please enter credentials", 404))
        }

        const user = await User.findOne({ username });

        if (user) return res.status(400).json('user allready exist', 400)


        const newUser = await User.create(req.body);

        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });

        res.status(200).json({ success: true, user: newUser, token });

    } catch (err) {
        next(err)
    }
}));


router.post('/jwt', isLoggedIn, catchAsyncError(async function (req, res, next) {
    try {

        const id = req.user._id;

        const user = await User.findById(id);

        if (!user) return res.status(400).json('user  not found', 400)


        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });

        res.status(200).json({ success: true, user: user, token });

    } catch (err) {
        next(err)
    }
}));


router.post("/login", catchAsyncError(async function (req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json('user not found', 400)

        const isMatch = await user.comparePassword(password);

        if (!isMatch) return res.status(400).json('password not match', 400)

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });
        res.status(200).json({ success: true, user, token: token });
    }
    catch (err) {
        next(err)
    }
}))


router.get('/logout', catchAsyncError(function (req, res, next) {
    try {
        req.user = null;
        res.status(200).json({ success: true, message: "logout" });
    } catch (err) {
        next(err)
    }
}))

router.post('/forgot', catchAsyncError(async function (req, res, next) {
    const { contact } = req.body;

    try {
        const user = await userModel.findOne({ contact });

        if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.EXPIRE) });

            res.json({ success: true, token, user })

        } else {
            return next(new ErrorHandler("please enter correct mobile number", 404));
        }

    } catch (err) {
        next(err)
    }
}));



module.exports = router;
