import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../auth/authSlice";
import logo from "../../../assets/logo.png"
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
            console.log(formData);

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
            setLoading(false)
        }
    }
    return <>
        {/* <h1>SignIN page</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div className="container">
            <form onSubmit={FaSignIn}>
                <div className="form-group">
                    <input type="text" className="form-control" ref={emailRef} placeholder="Enter email" required />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" ref={passwordRef} placeholder="Enter password" required />
                </div>
                <button type="submit">Sign-Inn</button>
            </form>
        </div> */}

        <div className="container">
            <h2 id="heading">Faculty</h2>
            <div className="Innercontainer">
                <div className="form">
                    <form onSubmit={FaSignIn}>
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
                            {loading ? "Sign In..." : "SignIn Now"}
                        </button>
                        <Link className="btn btn-block text-dark" to={'/faculty-signUp'}>CREATE ACCOUNT<span className="text-primary"> SignIn</span></Link>
                    </form>
                </div>
                <div className="image">
                    <img src={logo} alt="Logo" />
                </div>
            </div>
        </div>
    </>
}
export default FaSignIn;