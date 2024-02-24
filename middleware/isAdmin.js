// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../module/userSchema');


async function isAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        const userRole = await User.findById(user._id);
        if (userRole.role != 'admin') {
            res.status(400).json({ success: false, message: "only admin is allowed" });
        }
        req.user = user;
        next();
    });
}

module.exports = isAdmin;