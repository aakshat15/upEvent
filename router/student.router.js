import express from "express";
import { signUp , signInn , dashboard , Oneevent , eventRegister} from "../controller/student.controller.js" 
import { verifyToken } from "../Middleware/auth.middleware.js";
const studentRouter = express.Router();

// //SIGNUP SIGNINN
studentRouter.post("/student-signUp" , signUp);
studentRouter.post("/student-signInn" , signInn);

// // DASHBOARD
studentRouter.get("/student-dashBoard" , verifyToken , dashboard);

//  EVENT
studentRouter.get("/event/:eventId" , verifyToken , Oneevent)
studentRouter.post("/event/register/:eventId" , verifyToken , eventRegister )

export default studentRouter;