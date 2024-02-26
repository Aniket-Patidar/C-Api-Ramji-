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
// app.use(cors());


const corsOptions = {
    origin: 'http://example.com', // Allow requests from this origin
    methods: 'GET,POST', // Allow only specified methods
    allowedHeaders: 'Content-Type,Authorization', // Allow only specified headers
};

app.use(cors(corsOptions));


// const getProfile = async () => {
//     console.log("start process");
//     try {
//         const res = await axios.get("https://restapiramji.onrender.com/user/profile", {
//             headers: {
//                 "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQ5NTZiMjFjMDA0OGNlNzA3ZDE5N2UiLCJpYXQiOjE3MDg5MzQyMTgsImV4cCI6MTcwOTAyMDYxOH0.45LAQ41IpP8x8pCjyuI1VMu2B7cSJlp-kQGP8wRFZ3k"
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
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
