// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');


require('dotenv').config();


const usersRouter = require("./router/user");



// MongoDB connection
const connectDB = require('./module/dbconnection');
connectDB(); // Connect to MongoDB



// Middleware
// app.use(cors());


const corsOptions = {
    origin: '*', // Allow requests from this origin
    methods: 'GET,POST', // Allow only specified methods
    allowedHeaders: 'Content-Type,authorization',
    credential: true    
};

app.use(cors(corsOptions));



// const getProfile = async () => {
//     console.log("start process");
//     try {
//         const res = await axios.get("https://restapiramji.onrender.com/user/profile", {
//             headers: {
//                 "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWRiNTRhNjI4MjFjZWVjZjFiOTZiM2MiLCJpYXQiOjE3MDg5MzYwMzMsImV4cCI6MTcwOTAyMjQzM30.KkubgeQ_N5PEA2NOwPtrHhtyla7Oqo8Nc8bqkh56DV8"
//             }
//         });
//         console.log(res.data);
//         console.log("end process");
//         // Access the response data
//     } catch (err) {
//         console.log("error process");
//         console.error(err); // Log errors
//     }
// }

// getProfile();






app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



/* router */
app.get("/", (req, res) => {
    res.send("home")
})


app.use("/user", usersRouter)
app.use("/admin", require("./router/admin"))
app.use("/auth", require("./router/auth"))
app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: "path not found" })
})

const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);



// Start server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
