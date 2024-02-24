const express = require('express');
const router = express.Router();
const userModel = require('../module/userSchema');
const isAdmin = require('../middleware/isAdmin');
const catchAsyncError = require('../middleware/catchAsyncError');



router.get('/allUsers', isAdmin, catchAsyncError(async (req, res) => {
    try {
        const users = await userModel.find().sort({ totalCount: -1 });
        if (!users) return res.status(400).json('users not found', 400)

        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(400).json('error');
    }
}));


router.get('/dashboard', isAdmin, catchAsyncError(async function (req, res) {
    const userCount = (await userModel.find()).length;
    if (!userCount) return res.status(400).json('userCount not found', 400)

    const allUsers = await userModel.find();
    let totalRamnaamCount = 0;

    if (!allUsers) return res.status(400).json('allUsers not found', 400)

    allUsers.forEach(user => {
        totalRamnaamCount += user.totalCount;
    })
    res.json({ success: true, userCount, totalRamnaamCount });
}))


module.exports = router;