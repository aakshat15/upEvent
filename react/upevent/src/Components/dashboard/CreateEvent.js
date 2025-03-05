import axios from "axios";
import { useRef } from "react";

function CreateEvent() {
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

       await axios.post("http://localhost:3000/faculty/createEvent" , eventData ,{
        withCredentials: true
      })
       .then((Response) => {
            console.log(Response);
       })
       .catch((error) => {
        console.log(error);
       })
    }


    return <>
        <h1>NOW CREATE EVENT</h1>
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