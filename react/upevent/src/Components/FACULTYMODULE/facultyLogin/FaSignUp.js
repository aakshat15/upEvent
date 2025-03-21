import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/logo.png"

function FaSignUp() {

    const navigate = useNavigate()

    //FOR THE SIGN IN
    const facultyNumberRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const[loading , setLoading] = useState(false)


    const FaSignUp = async (e) => {
        setLoading(true)
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
            setLoading("false")
            toast.success(response.data.RESULT)
            setTimeout(() => {
                navigate("/faculty-signIn")
            }, 2000);
        } catch (error) {
            console.error("Error signing up:", error);
            // alert("Sign-up Failed! Please try again.");     
            toast.error("Sign-up Failed")
        }finally {
            setTimeout(() => {
                setLoading(false)
            }, 2500);
        }
        
    }
    return <>
            <div className="sign">
                <div className="container">
                    <div className="form">
                        <form onSubmit={FaSignUp}>
                        <h1 className="text-center">Sign-Up Now</h1>
                        <h6 className="text-center" style={{ color:"#3F72AF"}}>Please Enter your Detalis</h6>
                            <div className="form-group mt-5">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" ref={nameRef} placeholder="Enter your name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" ref={emailRef} placeholder="Enter your email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rollNumber">Roll Number</label>
                                <input type="text" className="form-control" ref={facultyNumberRef} placeholder="Enter your roll number" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" ref={passwordRef} placeholder="Enter your password" required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                            <Link className="btn btn-block text-dark" id="minibtn" to={'/faculty-signIn'}>Already have an account? <span className="text-primary">Sign In</span></Link>
                        </form>
                    </div>
                    <div className="text">
                    <h1 className="text-center">Welcome</h1>
                    <h5  className="text-center">You can sign-Up with Register Faculty number And Email account to controll Faculty Role</h5>
                </div>
                </div>
            </div>
    </>
}
export default FaSignUp;