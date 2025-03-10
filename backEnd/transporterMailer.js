import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transport = nodemailer.createTransport({
        service : "gmail" , 
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS,
        },
});

// export default transport;