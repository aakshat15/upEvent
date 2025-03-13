import axios from "axios";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function EventForm() {

    const { id } = useParams();
    const emailRef = useRef();
    const nameRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {

                await axios.get(`http://localhost:3000/student/event/${id}`)
                    .then((response) => {
                        console.log(response.data.Event);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
            catch (ERROR) {
                console.log(ERROR);
            }
        }
        fetchData();
    }, [])

    const registerOnEvent = async(e) => {
        e.preventDefault();

        const formData = {
            studentEmail: emailRef.current.value,
            studentName: nameRef.current.value
        };
        // console.log(formData.get('studentEmail')); // Correct way to log the value
        // console.log(formData.get('studentName'));

        await axios.post(`http://localhost:3000/student/event/register/${id}` , formData)
        .then((response)=>{
            console.log(response);
        })
        .catch((error)=>{
            console.log("error"+error);
        })
    }
    return <>
        <h1>EVENT REGISTRATION FORM</h1>
        <div className="container">
            <form onSubmit={registerOnEvent}>
                <div className="form-group">
                    <input type="text" className="form-control" ref={emailRef} placeholder="Enter email" required />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" ref={nameRef} placeholder="Enter name" required />
                </div>
                <button type="submit">Sign-Inn</button>
            </form>
        </div>



    </>
}
export default EventForm;