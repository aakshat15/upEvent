
import jwt from "jsonwebtoken";
import registers from "../models/register.model.js";
import Detalis from "../models/register.model.js";
import event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.js";

export const signUp = async (req, res, next) => {
    try {
        const { rollNumber, name, email, password } = req.body;

        // Find user by rollNumber & email
        let user = await registers.findOne({ where: { rollNumber, email } });
        // If user does not exist
        if (!user) {
            return res.status(400).json({ message: "PLEASE CHECK YOUR EMAIL AND ROLL NUMBER" });
        }
        else {
            // If name or password is NULL, allow updating because this is first time registerd
            if (!user.password || !user.name) {
                await registers.update(
                    { name, email, password }, // udate the filed
                    { where: { rollNumber } }
                );

                return res.status(200).json({
                    result: `STUDENT CREATED: ${email}`,
                });
            }
            else {
                // If user is already registered
                return res.status(400).json({ message: "Already Registered" });
            }
        }

    } catch (error) {
        res.status(500).json({ message: `Server Error Due to ${error}` });
    }

}

export const signInn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const role = "student"

        let user = await registers.findOne({ where: { email, role, password } });
        if (!user) return res.status(400).json({ message: "Not Registered Creadencial" })
        else {

            if (password === user.password) {
                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_KEY,
                );
                // SENDING TOKEN IN FORM OF COOKIES
                res.cookie("token", token, {
                    httpOnly: true,//xss Atacks
                })


                // return res.status(200).json({  Result:'Sign Inn success' ,})
                return res.status(200).json({ Route_get: "/student/student-dashBoard` " })
            }
            else { return res.status(400).json({ message: `password is Wroung` }) }
        }

    } catch (error) {
        res.status(500).json({ message: `Server Error Due to ${error}` })
    }
}

export const dashboard = async (req, res, next) => {

    try {

        const events = await event.findAll({})

        res.cookie("eventId" , events.id)
        res.status(200).json({ RESULT: "Success Deshboard Render", Onclick_On_ANYTASK_GET_REQ: `/user/event=`, EVENT: events })

    } catch (error) {
        res.status(500).json({ Erro: `Server Error Due to${error}` })
    }
}   

export const Oneevent = async ( req , res , next ) => {

  try{
      const eventId = req.params.eventId;

      let Event = await event.findOne({ where : { id:eventId}});
    //   res.cookie("eventId", eventId, {
    //     httpOnly: true,//xss Atacks
    // })
      res.status(200).json({FilledForm_Router_Post_Req: '' , Event});
  }catch(error){
      res.status(500).json({ERROR:`Server Error Due to ${error}`})
  }
}

export const eventRegister = async ( req , res , next ) => {
    
    try{

        const { studentName , studentEmail} = req.body;
        const eventId = req.params.eventId;

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }
        // Decode token to get faculty ID
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const rollNumber = decoded.id; // Extracting faculty ID from token
        console.log(studentName,studentEmail,eventId,rollNumber);

        let event = EventRegistration.create(studentName,studentEmail,eventId,rollNumber)

        res.status(200).json({result:{event}})
    }catch(error){
        res.status(500).json({ result:`Error Due to ${error}`})
    }
}