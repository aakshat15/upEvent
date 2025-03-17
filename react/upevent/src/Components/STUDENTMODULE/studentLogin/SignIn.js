import "./SignIn.css"
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../auth/authSlice";

function SignIn() {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const emailRef = useRef();
    const passwordRef = useRef();
    const[loading , setLoading] = useState(false);

    const signIn = async (e) => {
        setLoading(true)
        e.preventDefault();
        const formData = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        await axios.post("http://localhost:3000/student/student-signInn", formData)
            .then((res) => {

                const token = res.data.token; // Extract token from response

                const user = res.data.user;
                
                dispatch(loginSuccess({ token, user}));

                toast.success(res.data.Result || "Sign In ")
                setTimeout(() => {
                    navigate("/student-DashBoard")
                }, 2000);
            })
            .catch((error) => {
                console.log(error.response);
                setLoading(false)
                toast.error(error.response.data.message || error.response.data.error.errors[0].msg)
            }).finally(()=>{
                setTimeout(() => {
                    setLoading(false)
                }, 2500);
            })
    }
    return <>   
        <div className="container">
            <div className="Innercontainer">
            <h2 id="heading">STUDENT SIGN IN</h2>
                <div className="form">
                    <form onSubmit={signIn}>
                        <h2>Sign In</h2>
                        <div className="form-group">
                            <label for="email">Email</label>
                            <input type="email" className="form-control" ref={emailRef} placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label for="password">password</label>
                            <input type="password" className="form-control" ref={passwordRef} placeholder="Enter your password" required />
                            <span id="forget">forget password</span>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                        <Link className="btn btn-block text-dark" to={'/student-signUp'}>CREATE ACCOUNT<span className="text-primary"> SignIn</span></Link>
                    </form>
                </div>
                <div className="image">
                    <img src={logo} alt="Logo" />
                </div>
            </div>
        </div>
    </>
}
export default SignIn;