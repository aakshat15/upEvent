import "./SignIn.css";
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
    const navigate = useNavigate();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const rollNumberRef = useRef();

    const [loading, setLoading] = useState(false); // Loading state

    const signUp = async (e) => {
        e.preventDefault();

        setLoading(true); // Start loading

        const formData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            rollNumber: rollNumberRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await axios.post("http://localhost:3000/student/student-signUp", formData);
            toast.success(res.data.message);

            // Delay navigation to allow toast to be visible
            setTimeout(() => {
                navigate("/student-signIn");
            }, 2000); // Wait 2 seconds before redirecting

        } catch (error) {
            console.log(error);
            setLoading(false)
            toast.error(error.response.data.message || "Sign-up failed!");
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 2500)
        }
    };

    return (
        <>
            <div className="sign">
                <div className="container">
                    <div className="form">
                        <form onSubmit={signUp}>
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
                                <input type="text" className="form-control" ref={rollNumberRef} placeholder="Enter your roll number" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" ref={passwordRef} placeholder="Enter your password" required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                            <Link className="btn btn-block text-dark" id="minibtn" to={'/student-signIn'}>Already have an account? <span className="text-primary">Sign In</span></Link>
                        </form>
                    </div>
                    <div className="text">
                    <h1 className="text-center">Welcome</h1>
                    <h5  className="text-center">You can sign-Up with Register number And Email account</h5>
                </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;
