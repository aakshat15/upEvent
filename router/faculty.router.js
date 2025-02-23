import express from "express";
import { createFaculty , facultySignInn , dashBoard , createStudent , createEvent , myEvents , allEvents} from "../controller/faculty.controller.js";
import { verifyToken } from "../Middleware/auth.middleware.js";

const facultyRouter = express.Router();

//LOGIN LOGOUT
facultyRouter.post("/faculty-signUp" , createFaculty);
facultyRouter.post("/faculty-signInn"  , facultySignInn);

//DASHBOARD
facultyRouter.get("/faculty-dashBoard" , verifyToken , dashBoard)

//CREATE USER ROLLNUMBER
facultyRouter.post("/createStudent" , createStudent)

//CREATE EVENTS
facultyRouter.post("/createEvent" , verifyToken , createEvent);

//EVENTS
facultyRouter.get("/myEvents" , verifyToken , myEvents)
facultyRouter.get("/allEvents" , allEvents);

export default facultyRouter;
