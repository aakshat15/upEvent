import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CreateEvent.css'
import { toast } from "react-toastify";
//FOR GOOGLE CAPTCHA
// import ReCAPTCHA from "react-google-recaptcha";

function CreateEvent() {
    const navigate = useNavigate();
    
    
    const titleRef = useRef();
    const descriptionRef = useRef();
    const endDateRef = useRef();
    const locationRef = useRef();



    const RegisterEvent = async (e) => {
        e.preventDefault();
        const eventData = {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            endDate: endDateRef.current.value,
            location: locationRef.current.value
        }

        try {
            const token = sessionStorage.getItem("token"); // Retrieve token from localStorage or sessionStorage
            
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }
            
            const response = await axios.post(
                "http://localhost:3000/faculty/createEvent",
                eventData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`, // Add the authentication token
                        "Content-Type": "application/json"
                    }
                }
            );  
    
            toast.success(response.data||"CREATED SUCCESSFULL")
            setTimeout(()=>{
                navigate("/faculty-DashBoard")
            },2000)
        } catch (error) {
            console.error("Error creating event:", error.response.data );
            toast.error(error.response.data.message)
        }
    }


    return <>
    <div className="container">
    <div className="event-form">
    <h1>CREATE EVENT NOW</h1>
        <form onSubmit={RegisterEvent}>
            <div className="form-group">
                <input type="text"  className="form-control" ref={titleRef} placeholder="ENTER EVENT TITLE" required/>
            </div>
            <div className="form-group">    
                <textarea className="form-control" ref={descriptionRef} rows="1" placeholder="Describe your event..." required></textarea>
            </div>
            <div className="form-group">
                <select className="form-control" ref={locationRef} required>
                    <option value="" disabled selected>Choose Location</option>
                    <option value="INDORE">Indore</option>
                    <option value="BHOPAL">Bhopal</option>
                    <option value="DEWAS">Dewas</option>
                    <option value="PITAMPUR">Pitampur</option>
                </select>
            </div>
            <div className="form-group">
                <label id="eDATE">EndDate</label>
                <input type="date" ref={endDateRef}  className="form-control" id="endDate" placeholder="EndDate" required/>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Create Event</button>
        </form>
    </div>
</div>
    </>
}
export default CreateEvent;