// authMiddleware.js
const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
    const authHeader = req.headers['authorization'];
    // const authHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWRiNTRhNjI4MjFjZWVjZjFiOTZiM2MiLCJpYXQiOjE3MDg5NDQ1NzYsImV4cCI6MTcwOTAzMDk3Nn0.u7vk5OXNZ9YSo98Kg6l319idrKI3AZXazydO1bYnais";
    const token = authHeader;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid user credentials" });
        req.user = user;
        next();
    });
}

module.exports = isLoggedIn;