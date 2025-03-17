import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./dashBoard.css";

function StudentDashBoard() {
    const navigate = useNavigate();
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [unregisteredEvents, setUnregisteredEvents] = useState([]);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchUnregisteredEvents();
        fetchRegisteredEvents();
    }, []);

    const fetchUnregisteredEvents = async () => {
        try {
            const res = await axios.get("http://localhost:3000/student/student-dashboard");
            setUnregisteredEvents(res.data.UNREGISTERDEVENT);
        } catch (error) {
            console.error("Error fetching unregistered events:", error);
            alert("SERVER ERROR");
        }
    };

    const fetchRegisteredEvents = async () => {
        try {
            const res = await axios.get("http://localhost:3000/student/student-dashboard");
            setRegisteredEvents(res.data.REGISTEREDEVENT);
        } catch (error) {
            console.error("Error fetching registered events:", error);
            alert("SERVER ERROR");
        }
    };

    const handleForm = (id) => {
        navigate(`/student-eventForm/${id}`);
    };

    const handleDetails = (id) => {
        console.log(id);
    };

    return <>
        <div className="studentDashboard">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" id="nav" href="#">
                    <img src={logo} alt="Logo" />
                    <span>Bootstrap</span>
                </a>

                {/* Burger Button for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible Navbar Links */}
                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
                    <div className="navbar-nav ml-auto">
                        <Link className="nav-link" onClick={() => setActiveTab("upcoming")}>
                            Upcoming Events
                        </Link>
                        <Link className="nav-link" onClick={() => setActiveTab("past")}>
                            Past Events
                        </Link>
                        <Link className="nav-link" onClick={() => setActiveTab("registered")}>
                            Registered Events
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Upcoming Events */}
            {activeTab === "upcoming" && (
                <div className="upcoming-container">
                    <h1 className="heading">UPCOMING EVENTS</h1>
                    <div className="row">
                        {unregisteredEvents
                            .filter((event) => new Date(event.endDate).getTime() >= Date.now())
                            .map((event) => (
                                <div className="col-md-4 mb-4" key={event.id}>
                                    <div
                                        className="card"
                                        onClick={() => handleForm(event.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img src={event.imagePath} className="card-img-top w-100" alt="Event" />
                                        <div className="card-body">
                                            <h5 className="card-title">{event.title}</h5>
                                            <p className="text-danger">End Date: {new Date(event.endDate).toDateString()}</p>
                                            <button className="btn btn-danger">REGISTER NOW</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Past Events */}
            {activeTab === "past" && (
                <div className="past-container">
                    <h1 className="heading">RECENTLY ENDED EVENTS</h1>
                    <div className="row">
                        {unregisteredEvents
                            .filter((event) => new Date(event.endDate).getTime() < Date.now())
                            .map((event) => (
                                <div className="col-md-4 mb-4" key={event.id}>
                                    <div
                                        className="card"
                                        onClick={() => handleDetails(event.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img src={event.imagePath} className="card-img-top w-100" alt="Event" />
                                        <div className="card-body">
                                            <h5 className="card-title">{event.title}</h5>
                                            <p className="text-danger">End Date: {new Date(event.endDate).toDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Registered Events */}
            {activeTab === "registered" && (
                <div className="registered-container">
                    <h1 className="heading">REGISTERED EVENTS</h1>
                    <div className="row">
                        {registeredEvents.length === 0 ? (
                            <p>No registered events found.</p>
                        ) : (
                            registeredEvents.map((event) => (
                                <div className="col-md-4 mb-4" key={event.id}>
                                    <div
                                        className="card"
                                        onClick={() => handleDetails(event.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img src={event.imagePath} className="card-img-top w-100" alt="Event" />
                                        <div className="card-body">
                                            <h5 className="card-title">{event.title}</h5>
                                            <p className="text-danger">End Date: {new Date(event.endDate).toDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    </>
}

export default StudentDashBoard;
