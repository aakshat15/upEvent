import jwt from "jsonwebtoken";
import localStorage  from "localStorage";
export const verifyToken = (req, res, next) => {
  
    const token = localStorage.getItem("token")

    // console.log(token);
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY); 
            req.user = decoded; // RETURN ID
            next(); // Continue to protected route
        } catch (error) {
            res.status(401).json({ message: "Invalid Token" });
        }
    }
    else{
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
};
