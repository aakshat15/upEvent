import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateEvent() {


    const[error,setError]=useState("")
    //NAVIGATE FOR
    const navigate = useNavigate();
    
    
    const titileRef = useRef();
    const descriptionRef = useRef();
    const endDateRef = useRef();
    const locationRef = useRef();



    const RegisterEvent = async (e) => {
        e.preventDefault();
        const eventData = {
            title: titileRef.current.value,
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
    
            console.log("Event Created Successfully:", response.data);

            //CLEAR MESSAGE OF ERROR
            setError("EVENT CREATED")
            alert("EVENT CREATED")

            //NAVIGATE TO DASBOARD
            navigate("/faculty-DashBoard")
        } catch (error) {
            console.error("Error creating event:", error.response.data );
            const errormsg = error.response.data.message
            // console.log(errormsg);
            setError(errormsg)
        }
    }


    return <>
        <h1 >NOW CREATE EVENT</h1>
        <span className="text text-danger">{error}</span>
        <form onSubmit={RegisterEvent}>
            <div className="form-group">
                <input type="text" className="form-control" ref={titileRef} placeholder="Enter TITLE" required />
            </div>
            <div className="form-group">
                <textarea type="email" className="form-control" ref={descriptionRef} placeholder="Enter DESCRIPTION" required />
            </div>
            <div className="form-group">
                <input type="date" className="form-control" ref={endDateRef} placeholder="Enter endDate" required />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" ref={locationRef} placeholder="Enter location" required />
            </div>
            <button type="submit">SignUp</button>
        </form>
    </>
}
export default CreateEvent;