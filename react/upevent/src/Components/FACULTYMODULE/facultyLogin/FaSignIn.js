import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../auth/authSlice";
import '../../STUDENTMODULE/studentLogin/SignIn.css'
import { toast } from "react-toastify";

function FaSignIn() {
    //FOR NAVIGATE
    const navigate = useNavigate();
    //FOR DISPATCH TO REDUX
    const dispatch = useDispatch();

    //FOR REF IN INPUTE
    const emailRef = useRef();
    const passwordRef = useRef();

    //FOR THE ERROR
    const [loading, setLoading] = useState(false);

    const FaSignIn = async (e) => {
        e.preventDefault();
        setLoading(true)
        // console.log(emailRef.current.value);
        // console.log(passwordRef.current.value);

        const formData = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            //IT WAS RETURNING PROMISE YOU CAN ALSO USE THEN CATCH
            const response = await axios.post("http://localhost:3000/faculty/faculty-signInn"
                , formData )

            const token = response.data.token; // Extract token from response
            if (token) {
                console.log("Token stored:", token);
            }
            // console.log(formData);

            // Dispatch Redux action to store token & user
            dispatch(loginSuccess({ token, user: formData.email }));

            setTimeout(() => {
                toast.success("SIGN IN SUCCESS")
                return navigate("/faculty-DashBoard");
            }, 2000);
            
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.message)
                } else if (error.response.status === 403) {
                    console.log(error.response);
                    
                    toast.error("PLEASE CHECK EMAI AND VERIFIED FIRST")
                }
            } else {
                toast.error("NetWork error . please check your connection")
            }
        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 2500);
        }
    }
    return <>
        <div className="sign">
            <div className="container">
                <div className="form">
                    <form onSubmit={FaSignIn}>
                        <h1 className="text-center">Sign In Now</h1>
                        <h6 className="text-center" style={{ color:"#3F72AF"}}>Please Enter your Detalis</h6>
                        <div className="form-group mt-4">
                            <label for="email">Email</label>
                            <input type="email" className="form-control" ref={emailRef} placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label for="password">password</label>
                            <input type="password" className="form-control mb-0" ref={passwordRef} placeholder="Enter your password" required />
                            <span id="forget">forget password?</span>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                        <Link className="btn btn-block text-dark" id="minibtn" to={'/faculty-signUp'}>CREATE ACCOUNT<span className="text-primary"> SignIn</span></Link>
                    </form>
                </div>
                <div className="text">
                    <h1 className="text-center">Welcome back</h1>
                    <h5  className="text-center">You can sign in to access with your existing account</h5>
                </div>
            </div>
        </div>
    </>
}
export default FaSignIn;