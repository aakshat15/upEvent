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
                    from: `"UpEvent | Event Management" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: "Verify Your Email for UpEvent Registration",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                            <h2 style="color: #2c3e50; text-align: center;">Verify Your Email</h2>
                            <p style="font-size: 16px; color: #444;">Hello,</p>
                            <p style="font-size: 16px; color: #444;">
                                Thank you for registering for <strong>UpEvent</strong>. To complete your registration, please verify your email by clicking the button below.
                            </p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${verificationLink}" 
                                   style="background-color: #3498db; color: #fff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                                   Verify Email
                                </a>
                            </div>
                            <p style="font-size: 14px; color: #888;">
                                If the button above doesn’t work, you can also verify your email by clicking the following link:
                            </p>
                            <p style="word-wrap: break-word; font-size: 14px; color: #3498db;">
                                <a href="${verificationLink}" style="color: #3498db;">${verificationLink}</a>
                            </p>
                            <p style="font-size: 14px; color: #888;">If you did not request this, please ignore this email.</p>
                            <p style="font-size: 14px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} UpEvent. All rights reserved.</p>
                        </div>
                    `,
                };
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

              // Send email with roll number
              const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "🎉 Registration Successful | Welcome In upEvent!",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <div style="text-align: center; padding-bottom: 10px;">
                            <h2 style="color: #2c3e50;">🎓 Student Registration Successful</h2>
                        </div>
                        <div style="background: #ffffff; padding: 20px; border-radius: 6px;">
                            <p style="font-size: 16px; color: #555;">Dear Student,</p>
                            <p style="font-size: 16px; color: #555;">
                                Congratulations! You have been successfully registered in our system. Here are your details:
                            </p>
                            <div style="background: #f1f1f1; padding: 10px; border-radius: 4px; margin: 15px 0;">
                                <p style="margin: 5px 0; font-size: 16px; color: #333;"><strong>🎟 Roll Number:</strong> ${rollNumber}</p>
                            </div>
                            <p style="font-size: 16px; color: #555;">Best Regards,</p>
                            <p style="font-size: 16px; color: #333; font-weight: bold;">upEvent Team</p>
                        </div>
                    </div>
                `,
            };
            
        await transport.sendMail(mailOptions);

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

export const eventUpdate = async (req , res , next) => {
    try {
        const { id } = req.params;
        const { title, endDate, imagePath } = req.body;

        await event.update(
            { title, endDate, imagePath }, // Fields to update
            { where: { id } } // Condition to find the record
          );
          
        res.json({ message: "Event updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update event" });
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