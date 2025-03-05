import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function FaSignUp() {

    const navigate = useNavigate()

    //FOR THE SIGN IN
    const facultyNumberRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();


    const FaSignUp = async (e) => {
        e.preventDefault();
        // console.log("FacultyNumber"+facultyNumberRef.current.value);
        // console.log("name"+ nameRef.current.value);
        // console.log("email"+emailRef.current.value);
        // console.log("password"+passwordRef.current.value);
        
        const formData = {
            facultyNumber : facultyNumberRef.current.value,
            name : nameRef.current.value,
            email : emailRef.current.value,
            password : passwordRef.current.value
        }
        
        try {
            const response = await axios.post("http://localhost:3000/faculty/faculty-signUp", formData);
            console.log(response.data);
            alert(response.data.RESULT)
            navigate("/faculty-signIn")
        } catch (error) {
            console.error("Error signing up:", error);
            alert("Sign-up Failed! Please try again.");     
        }
        
    }
    return <>
    <h1>FACULTY SIGNUP PAGE</h1>
    <div className="container">
        <form onSubmit={FaSignUp}>
        <div className="form-group">
            <input type="text" className="form-control" ref={facultyNumberRef} placeholder="Enter FacultyNumber" required />
           </div>
           <div className="form-group">
            <input type="text" className="form-control" ref={nameRef} placeholder="Enter name" required />
           </div>
           <div className="form-group">
            <input type="email" className="form-control" ref={emailRef} placeholder="Enter mail" required />
           </div>
           <div className="form-group">
            <input type="password" className="form-control" ref={passwordRef} placeholder="Enter password" required />
           </div>
           <button type="submit">SignUp</button>
        </form>
    </div>
    </>
}
export default FaSignUp;