
import jwt from "jsonwebtoken";
import student from "../models/student.model.js";
import event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.js";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { validationResult } from "express-validator";
import localStorage from "localStorage"

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const signUp = async (req, res, next) => {
    
    // console.log(req.body);
    
    // Check validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
    try {
        const {  name, email, password } = req.body;
        
        // Check if user with the given rollNumber exists
        let user = await student.findOne({ where: {  email } });

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
            const token = jwt.sign({ email }, process.env.JWT_KEY); // Token expiration added for security

            const verificationLink = `http://localhost:3000/api/verifyStudent/${token}`;
            
            // Email options to send verification email
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
            

            // Send the verification email
            await transport.sendMail(mailOptions);

            // Update the user record with the new details (name, email, hashed password, and unverified status)
            await student.update(
                { name,  password: hashedPassword, isVerified: "false" , },  // Assuming 'isVerified' is a boolean
                { where: { email } }
            );

            return res.status(200).json({ result: `STUDENT CREATED: ${email}` , message:"check you email and verify it" });
        } else {
                // If user is already registered and has necessary information (password & name)
                return res.status(401).json({ message: "Already Registered" });
            }
    } catch (error) {
        // Catch and handle server errors
        console.log('Error during sign-up:', error);
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
    }
    else {
        res.status(400).json({message: "PASSWORD MUST BE 2 - 10 Length",})
    }
};
export const signInn = async (req, res, next) => {

    let error = validationResult(req);

    if (error.isEmpty()) {
        try {
            const { email, password } = req.body;
            
            
            let user = await student.findOne({ where: { email } })
            
            if (!user || user.password==null){
                return res.status(400).json({ message: "Register First" })
            } 
            else{
                
                if (user.isVerified == "false") {
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
                    // SENDING TOKEN IN FORM OF localStorage
                    localStorage.setItem("token", token)
                    
                    
                    return res.status(200).json({  Result:'Sign Inn success' , token , user})
                    // return res.status(200).json({ Route_get: "/student/student-dashBoard` " })
                }
                else { return res.status(400).json({ message: `password is Wroung` }) }
            }
        }

        } catch (error) {
            res.status(500).json({ message: `Server Error Due to ${error}` })
        }
    }
    else {
        res.status(400).json({ msg: "bad request for filed restraction", error })
    }
}

export const dashboard = async (req, res, next) => {

    try {
         // Decode token to get student roll number
         const token = localStorage.getItem('token')
         const decoded = jwt.verify(token, process.env.JWT_KEY);
         const rollNumber = decoded.id;
        
       // Fetch all events

       const events = await event.findAll({});

         // Fetch registered events for the student
         const registeredEvents = await EventRegistration.findAll({
            where: { rollNumber }
        });

        const registeredEventsId =registeredEvents.map(reevents => reevents.eventId)

        const unRegisterdEvent = events.filter(evt => !registeredEventsId.includes(evt.id))

        const registeredEvent = events.filter(evt => registeredEventsId.includes(evt.id))

        res.status(200).json({ RESULT: "Success Deshboard Render", UNREGISTERDEVENT: unRegisterdEvent , REGISTEREDEVENT:registeredEvent })

    } catch (error) {
        res.status(500).json({ Erro: `Server Error Due to${error}` })
    }
}

// export const insertRollNumber = async (req, res , next) => {
//     const {rollNumber , email} = req.body;
//     try{

//         const user = await student.update({  where : {email}});
//         if(!user){
//             return res.status(404).json({message : 'User not Found'})
//         }
//         console.log(user);
        
//         return res.status(200).json({result:'SuccessFull Updated'});
//     }
//     catch(error){
//         return res.status(500).json({message : `Server Error${error}`})
//     }

// }

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

            const { name , email , branch , number } = req.body;
            const eventId = req.params.eventId;
            
            const token = localStorage.getItem('token');
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: SIGNINN FIRST" });
            }


            // Decode token to get faculty ID
            const decoded = jwt.verify(token, process.env.JWT_KEY);

            const rollNumber = decoded.id; // Extracting faculty ID from token


            let event = await EventRegistration.create({ name, email , branch , number, eventId, rollNumber })

            res.status(200).json({ result: { event } })
        } catch (error) {
            res.status(500).json({ result: `Error Due to ${error}` })
        }
    }
    else {
        res.status(400).json({ msg: "Bad Request", error })
    }
}
