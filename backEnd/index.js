import express from "express";

import dotenv from "dotenv";
import path from 'path'

import facultyRouter from "./router/faculty.router.js";
import studentRouter from "./router/student.router.js";
import verifyRouter from "./router/verify.router.js";

import sequelize from "./db.ConfigSequelize/connection.js";
import assosiationEventndDetailsModel from "./models/Association/EventndRegisters.model.js";
import assisationEventRegistration from "./models/Association/assisation.eventRegistration.js";

import cors from "cors";
import upload from "./Middleware/upLoad.middleware.js";

const app = express();


//CORS USED FOR THE AXIOS 
app.use(cors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use .env variables
dotenv.config();
const PORT = process.env.PORT;



sequelize.sync().then(() => {
    console.log("DATABASE CONNECTED");
}).catch((err) => {
    console.log(`ERROR DUE TO ${err}`);
});

app.post("/new", upload.single("image"), (req, res) => {
   
    
    console.log(req.body.title);
    
    

    req.body.imageUrl = "http://localhost:3000/images" + req.file.filename
    console.log("http://localhost:3000/images" + req.file.filename)
    res.send("ok");
})
app.use("/student", studentRouter);
app.use("/faculty", facultyRouter);
app.use("/api", verifyRouter);



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}}`);
})