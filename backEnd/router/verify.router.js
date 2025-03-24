import Dotenv from "dotenv";
import jwt from "jsonwebtoken";
import faculty from "../models/faculty.model.js";
import express from "express";
import student from "../models/student.model.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt'
Dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const verifyRouter = express.Router();

// Faculty Email Verification
verifyRouter.get("/verifyFaculty/:token", async (req, res) => {
    try {
        console.log("Faculty verification is Running.....");
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY || "secretKey123");
        const email = decoded.email;

        let user = await faculty.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Invalid verification link" });
        }

        await faculty.update({ isVerified: true }, { where: { email } });

        res.send("<h1>Faculty's Email Verified Successfully! You can now log in.</h1>");
    } catch (error) {
        console.error(error);
        res.status(400).send(`<h1>Invalid or Expired Token: ${error.message}</h1>`);
    }
});

// Student Email Verification
verifyRouter.get("/verifyStudent/:token", async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY || "secretKey123");
        const email = decoded.email;

        let user = await student.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Invalid verification link" });
        }

        await student.update({ isVerified: true }, { where: { email } });

        res.send("<h1>Student's Email Verified Successfully! You can now log in.</h1>");
    } catch (error) {
        console.error(error);
        res.status(400).send(`<h1>Invalid or Expired Token: ${error.message}</h1>`);
    }
});

// Request Password Reset (No DB Changes)
verifyRouter.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await student.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate JWT token with 15 minutes expiry
        const resetToken = jwt.sign({ email }, process.env.JWT_KEY || "secretKey123", { expiresIn: "15m" });

        const resetLink = `http://localhost:3001/reset-password/${resetToken}`;
        
        // Send reset email
        await transport.sendMail({
            to: user.email,
            subject: "Reset Your Password - UpEvent",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #007bff; text-align: center;">Password Reset Request</h2>
                    <p>Dear ${user.name || "User"},</p>
                    <p>We received a request to reset your password for your UpEvent account. If you did not request this, you can safely ignore this email.</p>
                    <p>To reset your password, please click the button below:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                    <p style="word-wrap: break-word; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
                        <a href="${resetLink}" style="color: #007bff;">${resetLink}</a>
                    </p>
                    <p>This link is valid for the next <strong>15 minutes</strong>. After that, you will need to request a new password reset.</p>
                    <p>Best regards,<br>UpEvent Team</p>
                </div>
            `,
        });
        

        res.json({ message: "Reset email sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending reset email" });
    }
});

// Reset Password (Using JWT Token)
verifyRouter.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_KEY || "secretKey123");
        const email = decoded.email;

        // Find user by email
        const user = await student.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Hash the new password and update it
        const hashedPassword = await bcrypt.hash(password, 10);
        await student.update({ password: hashedPassword }, { where: { email } });

        res.json({ message: "Password reset successful!" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

export default verifyRouter;
