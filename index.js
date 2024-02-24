// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


require('dotenv').config();


const usersRouter = require("./router/user");



// MongoDB connection
const connectDB = require('./module/dbconnection');
connectDB(); // Connect to MongoDB



// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



/* router */
app.get("/", (req, res) => {
    res.send("home")
})


app.use("/user", usersRouter)
app.use("/admin", require("./router/admin"))
app.use("/auth", require("./router/auth"))
app.use("*", (req,res) => {
    res.status(404).json({ success: false, message: "path not found" })
})

const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);



// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
