import "./SignIn.css"
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SignIn() {
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();

    const signIn = async (e) => {
        e.preventDefault();
        const formData = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        await axios.post("http://localhost:3000/student/student-signInn", formData)
            .then((res) => {
                
                const token = res.data.token; // Extract token from response

                console.log(token);
                
                toast.success(res.data.Result || "Sign In ")
                setTimeout(()=>{
                    navigate("/student-DashBoard")
                },2000);
            })
            .catch((error) => {
                toast.error(error.response.data.message || error.response.data.error.errors[0].msg)
            })
    }
    return <>
        <div className="container">
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
                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                    <Link className="btn btn-block text-dark" to={'/student-signUp'}>CREATE ACCOUNT<span className="text-primary"> SignIn</span></Link>
                </form>
            </div>
            <div className="image">
                <img src={logo} alt="Logo" />
            </div>
        </div>
    </>
}
export default SignIn;