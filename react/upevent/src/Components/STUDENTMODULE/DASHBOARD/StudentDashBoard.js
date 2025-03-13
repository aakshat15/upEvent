import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png"
import "./dashBoard.css"
function StudentDashBoard() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            await axios.get("http://localhost:3000/student/student-dashboard")
                .then((res) => {
                    setData(res.data.EVENT);
                    // console.log(res.data.EVENT[1].endDate);
                    // console.log(Date.now());

                })
                .catch((error) => {
                    console.log(error);
                    alert("SERVER ERROR")
                })
        }
        fetchData();
    }, [])


    const handleClick = (id) => {
        navigate(`/student-eventForm/${id}`)
    }
    return <>
        <div className="studentDeshboard">
            <nav className="navbar">
                <a className="navbar-brand" id="nav" href="#">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top mr-2" alt="Logo" />
                    <span>Bootstrap</span>
                </a>
                {/* <div className="ml-auto"> */}
                <button className="btn btn-primary">Action Button</button>
                {/* </div> */}
            </nav>
            <div className="upComingcontainer mt-4">
            <h1>UPCOMING EVENT</h1>
                <div className="row">
                    {data
                        .filter(event => new Date(event.endDate).getTime() >= Date.now()) // Filtering events based on end date
                        .map((event, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card" onClick={() => handleClick(event.id)} style={{ cursor: "pointer" }}>
                                    <img src={event.imagePath} className="card-img-top w-100" alt="Event Image" />
                                    <div className="card-body">
                                        <h5 className="card-title">{event.title}</h5>
                                        <p className="text-danger">End Date: {event.endDate}</p>
                                        <button className="btn btn-danger">READ MORE</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

            </div>
            <h1>RECENT END EVENT</h1>
            <div className="endcontainer mt-4">
                <div className="row">
                    {data
                        .filter(event => new Date(event.endDate).getTime() <= Date.now()) // Filtering events based on end date
                        .map((event, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card" onClick={() => handleClick(event.id)} style={{ cursor: "pointer" }}>
                                    <img src={event.imagePath} className="card-img-top w-100" alt="Event Image" />
                                    <div className="card-body">
                                        <h5 className="card-title">{event.title}</h5>
                                        <p className="text-danger">End Date: {event.endDate}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

            </div>
        </div>
    </>
}
export default StudentDashBoard;