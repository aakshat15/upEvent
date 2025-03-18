import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css'
import { toast } from "react-toastify";import './Dashboard.css'
function EventForm(){
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
        console.log(formData);
        
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

    return (
        <div className="eventForm">
            <h1 className="heading">Create Event</h1>
            <div className="col-md-8 mt-2 p-4">
                <div className="card shadow p-4">
                    <form onSubmit={RegisterEvent}>
                        <div className="form-group">
                            <label>Event Title</label>
                            <input type="text" ref={titleRef} className="form-control" placeholder="Enter event title" required />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea ref={descriptionRef} className="form-control" rows="2" placeholder="Describe your event..." required></textarea>
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <select ref={locationRef} className="form-control" required>
                                <option value="" disabled selected>Choose Location</option>
                                <option value="INDORE">Indore</option>
                                <option value="BHOPAL">Bhopal</option>
                                <option value="DEWAS">Dewas</option>
                                <option value="PITAMPUR">Pitampur</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" ref={endDateRef} className="form-control" required />
                        </div>

                        <div className="form-group">
                            <label>Upload Image</label>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control-file" required />
                        </div>

                        <button type="submit" className="btn">Create Event</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventForm;
