import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt"
import { validationResult } from "express-validator";
// import transport  from "../transporterMailer.js";
import event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv";
import student from "../models/student.model.js";
import faculty from "../models/faculty.model.js";
import localStorage from "localStorage"
import fs from 'fs';
dotenv.config();
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const createFaculty = async (req, res, next) => {


    let errors = validationResult(req);

    if (errors.isEmpty()) {

        try {
            //facultyNumber THEN THE PLACE OF facultyNumber
            const { facultyNumber, name, email, password } = req.body;

            // Check if faculty exists in register table
            let Faculty = await faculty.findOne({ where: { facultyNumber, email } });

            //for the only one time login
            if (Faculty.password == null && Faculty.name == null) {

                //CReating bcrept password
                let saltKey = bcrypt.genSaltSync(10);
                const hashedPassword = await bcrypt.hash(password, saltKey);
                // console.log(hashedPassword);


                //FOR EVERY LINK UNIQUE
                const token = jwt.sign({ email }, process.env.JWT_KEY);

                const verificationLink = `http://localhost:3000/api/verifyFaculty/${token}`
                const mailOptions = {
                    from: `"EVENT MANEGMENT" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: "VERIFY YOUR EMAIL ",
                    html: `<p>Click the link below to verify your email for faculty</p>
                    <a href="${verificationLink}">${verificationLink}</a>`,
                }

                await transport.sendMail(mailOptions);

                // from null UPdate faculty in Detalis table
                Faculty = await faculty.update(
                    { name, password: hashedPassword, isVerified: "false", email },
                    { where: { facultyNumber } }
                );


                return res.status(200).json({ RESULT: "SIGNUP SUCCESS", STEP: "SEE YOUR EMAIL TO VERIFY" });
            }
        } catch (err) {
            return res.status(500).json({ message: `Faculty not registered due to: ${err.message}` });
        }
    }
    else {
        return res.status(400).json({ error: "Bad request", errors: errors.array() });
    }

}

export const facultySignInn = async (req, res) => {
    let error = validationResult(req);

    if (error.isEmpty()) {
        try {
            const { email, password } = req.body;
            let user = await faculty.findOne({ where: { email } });

            if (!user) return res.status(400).json({ message: "Not Registered Credential" });

            if (user.isVerified == "false") {
                return res.status(403).json({ message: "Please verify your email first" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Generate JWT Token
                const token = jwt.sign(
                    { id: user.id }, // Payload
                    process.env.JWT_KEY,
                    { expiresIn: "1h" } // Token expiration
                );

                localStorage.setItem("token", token); // Save token

                return res.status(200).json({ Result: "Sign In success", token });
            } else {
                return res.status(400).json({ message: "Wrong password" });
            }

        } catch (error) {
            res.status(500).json({ message: `Server Error: ${error.message}` });
        }
    } else {
        res.status(400).json({ request: "Bad Request", error: error.array() });
    }
};

export const dashBoard = async (req, res, next) => {
    const token = localStorage.getItem("token")
    // extract the id from token
    const createdByfaculty = jwt.verify(token, process.env.JWT_KEY).id;
    // console.log(createdByfaculty);

    // res.status(200).json({ RESULT: `SUCCESS AND DEASHBOARD RENDER` })
    res.status(200).json({ POST_EVENT_REQUEST: `/faculty/createEvent`, GET_MYEVENT_REQUEST: `/faculty/myEvents`, GET_ALL_REQUEST: "/faculty/AllEvents" })
}

export const createStudent = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {

        try {
            const rollNumber = `ROLL-${uuidv4().slice(0, 8)}`;
            const { email } = req.body;
            // Check if email exists in either student or faculty
            const userEmail = await student.findOne({ where: { email } });
            const userEmailInFaculty = await faculty.findOne({ where: { email } });


            if (userEmail || userEmailInFaculty) {
                return res.status(401).json({
                    message: `EMAIL IS ALREADY REGISTERD`
                });
            }

            // If no email found, create a new student
            await student.create({
                rollNumber,
                email,
            });

            return res.status(200).json({
                message: `STUDENT REGISTERD`,
                rollNumber: rollNumber,
            });

        } catch (error) {
            return res.status(200).json({
                message: `INTERNAL SERVER ERROR`
            });
        }

    } else {
        res.status(400).json({
            message: error,
        });
    }
}

export const createEvent = async (req, res, next) => {
    // Check if the event already exists
    const filePath = `./public/images/${req.file.filename}`;
    let error = validationResult(req);

    if (error.isEmpty()) {

        try {
            // console.log(req.body.title);
            // console.log("imagePath" + req.file.filename);
            let { title, description, location, endDate } = req.body;
            const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;

            // Extract token
            const token = localStorage.getItem("token")
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: No token provided." });
            }

            // Decode token to get faculty ID
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            const createdByfaculty = decoded.id; // Extracting faculty ID from token
            
            let existingEvent = await event.findOne({ where: { title, endDate } });
            // console.log(existingEvent);
            
            if (existingEvent) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                    console.log("EVENT EXISTENG AND DELETE PITURE");

                });
                return res.status(400).json({ message: `Event already exists: ${title}` });
            }

            
            // Create a new event
            const newEvent = await event.create({ title, description, endDate, location, createdByfaculty, imagePath, });

            res.status(201).json({
                message: "Event Created Successfully",
                event: newEvent,
                // dashboardURL: `/faculty/faculty-dashBoard/${createdByfaculty}`
            });

        } catch (error) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
                console.log("delete successfuly");
            });
            res.status(500).json({ message: `EVENT IS ALREADY EXSIST` })
        }
    }
    else {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
            console.log('File deleted successfully!');
        });
        return res.status(400).json({ error: "Bad request", errors: error.array() });
    }

}

export const myEvents = async (req, res, next) => {

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }

        // Decode token to get faculty ID
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const createdByfaculty = decoded.id; // Extracting faculty ID from token

        let events = await event.findAll({ where: { createdByfaculty } });
        if (events) return res.status(200).json({ AllEvents: events })
        else { res.json({ message: `Not have any events` }) }
    } catch (error) {
        res.status(500).json({ message: `ServerError due to ${error}` })
    }
}

export const allEvents = async (req, res, next) => {

    try {
        const events = await event.findAll({});
        if (events) return res.status(200).json({ SELECT_EVENT_FOR_StudentsDEtalis: "faculty/allEvents/:eventId", AllEvents: events })
        else { return res.json("NOT HAVE ANY EVENTS") }

    } catch (error) {
        res.status(500).json({ message: `SEVER ERROR DUE TO ${error}` })
    }


}

export const getDetails = async (req, res, next) => {

    try {

        const eventId = req.params.eventId;

        const student = await EventRegistration.findAll({ where: { eventId } })

        res.status(200).json({ mes: "SUCCESS", student })

    } catch (error) {
        res.status(500).json({ msg: `SERVER SIDE ERROR ${error}` })
    }
}