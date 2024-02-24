// authMiddleware.js
const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid user credentials" });
        req.user = user;
        next();
    });
}

module.exports = isLoggedIn;