const express = require('express');
const router = express.Router();
const userModel = require('../module/userSchema');
const isLoggedIn = require('../middleware/jwt');
const { use } = require('passport');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../middleware/ErrorHandler');



router.get('/', catchAsyncError(async function (req, res, next) {
    try {

        const userCount = (await userModel.find()).length;

        if (!userCount) return next(new ErrorHandler("userCount not found", 404))

        const allUsers = await userModel.find();
        let totalRamnaamCount = 0;

        if (!allUsers) return next(new ErrorHandler("allUsers not found", 404))


        allUsers.forEach(user => {
            totalRamnaamCount += user.totalCount;
        })

        res.json({ success: true, userCount, totalRamnaamCount })
    }

    catch (err) {
        next(err)
    }
}));


router.get('/profile', isLoggedIn, catchAsyncError(async function (req, res, next) {
    try {
        const userCount = (await userModel.find()).length;
        const user = await userModel.findById(req.user._id);
        if (!userCount) return next(new ErrorHandler("userCount not found", 404))
        if (!user) return next(new ErrorHandler("user not found", 404))

        res.json({ success: true, user: user, userCount });
    }
    catch (err) {
        next(err)

    }
}));


router.get('/allDevotees', isLoggedIn, catchAsyncError(async function (req, res, next) {
    try {
        const user = await userModel.findById(req.user._id);
        const allUsers = await userModel.find();
        if (!user) return next(new ErrorHandler("user not found", 404))
        if (!allUsers) return next(new ErrorHandler("allUsers not found", 404))

        res.json({ success: true, user, allUsers });

    } catch (err) {
        next(err)

    }
}));


router.get('/:name', isLoggedIn, catchAsyncError(async function (req, res) {
    try {
        const val = req.params.name;
        const users = await userModel.find({ name: new RegExp('^' + val, 'i') });
        if (!users) return next(new ErrorHandler("users not found", 404))

        res.json({ success: true, users });
    } catch (err) {
        next(err)

    }
}));


router.post('/lekhanHistory', isLoggedIn, catchAsyncError(async function (req, res) {
    try {
        const id = req.user._id;
        const user = await userModel.findById(id);


        if (!user) return next(new ErrorHandler("user not found", 404))


        res.json({ success: true, user });
    } catch (err) {
        next(err)

    }
}))


router.post('/save', isLoggedIn, catchAsyncError(async function (req, res) {
    try {
        const id = req.user._id;

        const user = await userModel.findById(id);
        if (!user) return next(new ErrorHandler("user not found", 404))



        let { currentCount, totalCount, malaCount } = req.body;

        currentCount = parseInt(currentCount)
        totalCount = parseInt(totalCount)
        malaCount = parseFloat(malaCount)


        user.totalCount = totalCount;
        user.mala = malaCount;
        user.currCount = 0;

        const today = new Date();

        const hasEntryForToday = user.dailyCounts &&
            user.dailyCounts.length > 0 &&
            user.dailyCounts[user.dailyCounts.length - 1].date.toDateString() === today.toDateString();

        if (hasEntryForToday) {
            user.dailyCounts[user.dailyCounts.length - 1].count += currentCount;
        } else {

            user.dailyCounts.push({ date: today, count: currentCount });
        }
        await user.save();
        const allUsers = await userModel.find({}, 'totalCount').sort({ totalCount: -1 });
        if (!allUsers) return next(new ErrorHandler("allUsers not found", 404))


        const bulkUpdateOps = allUsers.map((userDoc, index) => ({
            updateOne: {
                filter: { _id: userDoc._id },
                update: { rank: index + 1 }
            }
        }));

        await userModel.bulkWrite(bulkUpdateOps);

        res.json({ success: true, message: 'Counts, Mala, and Daily Counts updated successfully' });
    } catch (err) {
        next(err)
    }
}));



module.exports = router;