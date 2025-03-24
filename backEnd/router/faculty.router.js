import express from "express";
import { createFaculty, facultySignInn, dashBoard, createStudent, createEvent, myEvents, allEvents, getDetails , eventUpdate } from "../controller/faculty.controller.js";
import { verifyToken } from "../Middleware/auth.middleware.js";
import { body } from "express-validator";
import upload from "../Middleware/upLoad.middleware.js";
const facultyRouter = express.Router();

//LOGIN LOGOUT
facultyRouter.post("/faculty-signUp",
    body("email", "valid Email Enter").isEmail(),  //IS EMAIL OR NOT
    body("email", "please enter Email").notEmpty(), // EMAIL EMPTY CHECK
    body("password", "Please enter password").notEmpty(),   //PASSWORD EMPTY CHECK
    body("name", "Please Enter name").notEmpty(),
    body("facultyNumber", "Please Enter FacultyNumber").notEmpty(),
    createFaculty);


facultyRouter.post("/faculty-signInn",
    body("email", "PLASE ENTER VALID EMAIL").notEmpty().isEmail(),
    body("password", "PLEASE ENTER THE PASSWORD").notEmpty()
    , facultySignInn);


//DASHBOARD
facultyRouter.get("/faculty-dashBoard", verifyToken, dashBoard)


//CREATE USER ROLLNUMBER
facultyRouter.post("/createStudent",
    body("email", "ENTER VALID EMAIL").notEmpty().isEmail()
    , createStudent)

    
//CREATE EVENTS
facultyRouter.post("/createEvent",
    // body("title" , "PLEASE ENTER TITLE").notEmpty(),
    // body("description" , "PLEASE FILLED DESCRIPTION").notEmpty(),
    // body("location" , "PLEASE ENTER LOCATION").notEmpty(),
    // body("endDate" , "PLEASE ENTER ENDDATE").notEmpty()
     upload.single('image') , createEvent     
      );
facultyRouter.put('/updateEvent/:id' , eventUpdate);

//EVENTS
facultyRouter.get("/myEvents", verifyToken, myEvents)


facultyRouter.get("/allEvents", allEvents);


facultyRouter.get("/allEvents/:eventId" , getDetails)
export default facultyRouter;
