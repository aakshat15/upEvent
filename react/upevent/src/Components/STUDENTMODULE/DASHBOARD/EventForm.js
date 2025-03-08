import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function EventForm(){

    const {id} = useParams();

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


    return <>
    <h1>EVENT REGISTRATION FORM</h1>
        {/* <div className="container">
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


        
    </>
}
export default EventForm;