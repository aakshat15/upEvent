import express from "express";
import { signUp , signInn , dashboard , Oneevent , eventRegister    } from "../controller/student.controller.js" 
import { verifyToken } from "../Middleware/auth.middleware.js";
import { body } from "express-validator";

const studentRouter = express.Router();

// //SIGNUP SIGNINN
studentRouter.post("/student-signUp" ,
        body("rollNumber" , "Fill the rollNumber").notEmpty(),
        body("email", "valid Email Enter").isEmail(),  //IS EMAIL OR NOT
        body("email", "please enter Email").notEmpty(), // EMAIL EMPTY CHECK
        body("password", "Please enter password").notEmpty(),   //PASSWORD EMPTY CHECK
        body("name", "Please Enter name").notEmpty()
    , signUp);


studentRouter.post("/student-signInn" , signInn);

// // DASHBOARD
studentRouter.get("/student-dashBoard" , verifyToken , dashboard);

// studentRouter.post('/studentRollNumber' , insertRollNumber);
//  EVENT
studentRouter.get("/event/:eventId" , verifyToken , Oneevent)


studentRouter.post("/event/register/:eventId" ,
    body("email" , "Fill the email").notEmpty(),
    body("email", "valid Email Enter").isEmail(), 
    body("name" , "PLEASE FILL NAME").notEmpty(),
    verifyToken , eventRegister )

export default studentRouter;