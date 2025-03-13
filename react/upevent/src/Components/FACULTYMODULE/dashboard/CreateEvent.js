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
    const [image, setFile] = useState(null);


    const RegisterEvent = async (e) => {
        e.preventDefault();
    
        if (!image) {
            toast.error("Please select an image.");
            return;
        }
    
        const formData = new FormData();
        formData.append("title", titleRef.current.value);
        formData.append("description", descriptionRef.current.value);
        formData.append("endDate", endDateRef.current.value);
        formData.append("location", locationRef.current.value);
        formData.append("image", image); // Append file
    
        try {
            const token = sessionStorage.getItem("token"); 
            
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }
            
            const response = await axios.post(
                "http://localhost:3000/faculty/createEvent",
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data", // Important for file upload
                    }
                }
            );  
    
            toast.success("Event Created Successfully!");
            setTimeout(() => {
                navigate("/faculty-DashBoard");
            }, 2000);
        } catch (error) {
            console.error("Error creating event:", error.response?.data);
            toast.error(error.response?.data?.message || "Error creating event");
        }
    };


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
            <div className="form-group">
                <input type="file" onChange={(e)=>{ setFile(e.target.files[0]);}}  className="form-control" id="image"  required/>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Create Event</button>
        </form>
    </div>
</div>
    </>
}
export default CreateEvent;