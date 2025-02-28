
import jwt from "jsonwebtoken";
import registers from "../models/register.model.js";
import event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.js";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { validationResult } from "express-validator";


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const signUp = async (req, res, next) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "Bad request", error: errors.array() });
    }

    try {
        const { rollNumber, name, email, password } = req.body;

        // Check if user with the given rollNumber exists
        let user = await registers.findOne({ where: { rollNumber } });

        if (!user) {
            // If no user is found with the provided roll number, return an error
            return res.status(400).json({ message: "PLEASE CHECK YOUR EMAIL AND ROLL NUMBER" });
        }

        // If the user is found but the user is missing necessary details like name and password
        if (!user.password || !user.name) {
            
            // Hash the password using bcrypt
            const saltKey = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, saltKey);

            // Generate a unique JWT token for email verification
            const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' }); // Token expiration added for security

            const verificationLink = `http://localhost:3000/api/verify/${token}`;
            
            // Email options to send verification email
            const mailOptions = {
                from: `"EVENT MANAGEMENT" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "VERIFY YOUR EMAIL",
                html: `<p>Click the link below to verify your email for the student registration process:</p>
                       <a href="${verificationLink}">${verificationLink}</a>`,
            };

            // Send the verification email
            await transport.sendMail(mailOptions);

            // Update the user record with the new details (name, email, hashed password, and unverified status)
            await registers.update(
                { name, email, password: hashedPassword, isVerified: "false" , role:"student"},  // Assuming 'isVerified' is a boolean
                { where: { rollNumber } }
            );

            return res.status(200).json({ result: `STUDENT CREATED: ${email}` , pending:"check you email and verify it" });
        } else {
            // If user is already registered and has necessary information (password & name)
            return res.status(400).json({ message: "Already Registered" });
        }

    } catch (error) {
        // Catch and handle server errors
        console.error('Error during sign-up:', error);
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};
export const signInn = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {
        try {
            const { email, password } = req.body;
            const role = "student"

            let user = await registers.findOne({ where: { email, role } });
            if (!user) return res.status(400).json({ message: "Not Registered Creadencial" })

            if (!user.isVerified) {
                return res.status(403).json({ message: "Please verify your email first" });
            }

            else {

                const ismatch = await bcrypt.compare(password, user.password);
                // console.log(ismatch);

                if (ismatch) {
                    const token = jwt.sign(
                        { id: user.rollNumber },
                        process.env.JWT_KEY,
                    );
                    // SENDING TOKEN IN FORM OF COOKIES
                    res.cookie("token", token, {
                        httpOnly: true,//xss Atacks
                    })


                    return res.status(200).json({  Result:'Sign Inn success' ,})
                    // return res.status(200).json({ Route_get: "/student/student-dashBoard` " })
                }
                else { return res.status(400).json({ message: `password is Wroung` }) }
            }

        } catch (error) {
            res.status(500).json({ message: `Server Error Due to ${error}` })
        }
    }
    else {
        res.status(400).json({ msg: "bad request", error })
    }
}

export const dashboard = async (req, res, next) => {

    try {

        const events = await event.findAll({})

        // res.cookie("eventId", events.id)


        res.status(200).json({ RESULT: "Success Deshboard Render", EVENT: events })

    } catch (error) {
        res.status(500).json({ Erro: `Server Error Due to${error}` })
    }
}

export const Oneevent = async (req, res, next) => {

    try {
        const eventId = req.params.eventId;

        let Event = await event.findOne({ where: { id: eventId } });


        res.status(200).json({ FilledForm_Router_Post_Req: '', Event });
    } catch (error) {
        res.status(500).json({ ERROR: `Server Error Due to ${error}` })
    }
}

export const eventRegister = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {

        try {

            const { studentName, studentEmail } = req.body;
            const eventId = req.params.eventId;

            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: SIGNINN FIRST" });
            }


            // Decode token to get faculty ID
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            // console.log(decoded);

            const rollNumber = decoded.id; // Extracting faculty ID from token


            let existingRegistrations = await EventRegistration.findAll({ where: { studentName, eventId } });

            if (existingRegistrations.length > 0) {
                return res.status(400).json({ result: 'ALREADY REGISTERED' });
            }


            let event = await EventRegistration.create({ studentName, studentEmail, eventId, rollNumber })

            res.status(200).json({ result: { event } })
        } catch (error) {
            res.status(500).json({ result: `Error Due to ${error}` })
        }
    }
    else {
        res.status(400).json({ msg: "Bad Request", error })
    }
}