import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function FaSignIn() {

    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();

    //FOR THE ERROR
    const [errorMessage, setErrorMessage] = useState("");

    const FaSignIn = async (e) => {
        e.preventDefault();
        // console.log(emailRef.current.value);
        // console.log(passwordRef.current.value);

        const formData = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            //IT WAS RETURNING PROMISE YOU CAN ALSO USE THEN CATCH
            const response = await axios.post("http://localhost:3000/faculty/faculty-signInn", formData)
            console.log("Success", response.data);
            setErrorMessage("success")
            navigate("/faculty-dashboard");
        } catch (error) {
            if(error.response){
                if( error.response.status === 400){
                    setErrorMessage(error.response.data.message)
                }else if (error.response.status === 403){
                    setErrorMessage("PLEASE CHECK EMAIL AND VERIFIED FIRST");
                }
            }else{
                setErrorMessage("NetWork error . please check your connection")
            }
        }
    }
    return <>
        <h1>SignIN page</h1>
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
        </div>
    </>
}
export default FaSignIn;