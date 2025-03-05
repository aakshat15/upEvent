import Dotenv from "dotenv";
import jwt from "jsonwebtoken";
import faculty from "../models/faculty.model.js";
import express from "express";
import student from "../models/student.model.js";

Dotenv.config();

const verifyRouter = express.Router();

verifyRouter.get("/verifyFaculty/:token", async (req, res) => {
    try {
        console.log("Faculty verification is Running.....");
        const token = req.params.token;

        
        // Verify the token using the secret
        const decoded = jwt.verify(token,  process.env.JWT_KEY ||secratKey123  );

        // Extract the email from the decoded token
        const email = decoded.email;

        // Find the user by email
        let user = await faculty.findOne({where: { email: email }  });

        if (!user) {
            return res.status(400).json({ message: "Invalid verification link" });
        }
        else{
            // Update user's verification status
            await faculty.update({ isVerified: true }, { where: { email } });
            res.send("<h1>Faculty's Email Verified Successfully! You can now log in.</h1>");
        }


    } catch (error) {
        console.error(error);
        res.status(400).send(`<h1> or Expired Token${error}</h1>`);
    }
});

verifyRouter.get("/verifyStudent/:token", async (req, res) => {
    try {
        console.log("Student Verification is Running.....");
        const token = req.params.token;

        
        // Verify the token using the secret
        const decoded = jwt.verify(token,  process.env.JWT_KEY ||secratKey123  );

        // Extract the email from the decoded token
        const email = decoded.email;

        // Find the user by email
        let user = await student.findOne({where: { email: email }  });

        if (!user) {
            return res.status(400).json({ message: "Invalid verification link" });
        }
        else{
            // Update user's verification status
            await student.update({ isVerified: true }, { where: { email } });
            res.send("<h1>Student's Email Verified Successfully! You can now log in.</h1>");
        }


    } catch (error) {
        console.error(error);
        res.status(400).send(`<h1> or Expired Token${error}</h1>`);
    }
});

export default verifyRouter;
