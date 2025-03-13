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
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//CORS USED FOR THE AXIOS 
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/images")));


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