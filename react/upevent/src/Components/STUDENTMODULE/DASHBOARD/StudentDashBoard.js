import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./dashBoard.css";
import { useDispatch } from "react-redux";
import { logOut } from "../../auth/authSlice";

function StudentDashBoard() {
    //HOOKS
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //STATES
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
        navigate(`/student-eventForm/${id}`, { state: { activeTab } });
    };

    const signOut = () => {
        const confirmLogout = window.confirm("Are you sure you want to sign out?");
        if (confirmLogout) {
            dispatch(logOut())
        } else {
            console.log("Sign-out canceled");
        }
    };
    return <>
        <div className="studentDashboard">
            <div className="containt">
                <nav className="navbar navbar-expand-lg" id="navbar">
                    <a className="navbar-brand" id="nav">
                        <img src={logo} alt="Logo" />   
                        <span>UpEvent</span>
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
                            <Link
                                className={`nav-link ${activeTab === "upcoming" ? "selected" : ""}`}
                                onClick={() => setActiveTab("upcoming")}
                            >
                                Upcoming Events
                            </Link>
                            <Link
                                className={`nav-link ${activeTab === "past" ? "selected" : ""}`}
                                onClick={() => setActiveTab("past")}
                            >
                                Past Events
                            </Link>
                            <Link
                                className={`nav-link ${activeTab === "registered" ? "selected" : ""}`}
                                onClick={() => setActiveTab("registered")}
                            >
                                Registered Events
                            </Link>
                            <Link
                                className={`nav-link bg-danger text-light`}
                                onClick={signOut}
                            >
                            SignOut
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Upcoming Events */}
                {activeTab === "upcoming" && (
                    <div className="upcoming-container">
                        <h1 className="heading">UPCOMING EVENTS</h1>
                        <div className="row">
                            {unregisteredEvents.length > 0 ? (
                                unregisteredEvents.filter((event) => new Date(event.endDate).getTime() >= Date.now())
                                    .map((event, index) => (
                                        <div className="col-md-4 mb-4" key={index}>
                                            <div
                                                className="card event-card"
                                                onClick={() => handleForm(event.id, event )}
                                                style={{ backgroundImage: `url(${event.imagePath})` }}
                                            >
                                                <div className="card-content">
                                                    <h5 className="card-title">{event.title}</h5>
                                                    <p className="card-date">Ends on: {event.endDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <h2 className="ml-5 text-center text-muted ">No Upcoming Events Available</h2>
                            )}
                        </div>
                    </div>
                )}

                {/* Past Events */}
                {activeTab === "past" && (
                    <div className="past-container">
                        <h1 className="heading">RECENTLY ENDED EVENTS</h1>
                        <div className="row">
                            {unregisteredEvents.length > 0 ? (
                                unregisteredEvents.filter((event) => new Date(event.endDate).getTime() < Date.now())
                                    .map((event, index) => (
                                        <div className="col-md-4 mb-4" key={index}>
                                            <div
                                                className="card event-card"
                                                onClick={() => handleForm(event.id, event )}
                                                style={{ backgroundImage: `url(${event.imagePath})` }}
                                            >
                                                <div className="card-content">
                                                    <h5 className="card-title">{event.title}</h5>
                                                    <p className="card-date">Ends on: {event.endDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <h2 className="ml-5 text-center text-muted ">No Upcoming Events Available</h2>
                            )}
                        </div>
                    </div>
                )}

                {/* Registered Events */}
                {activeTab === "registered" && (
                    <div className="registered-container">
                        <h1 className="heading">REGISTERED EVENTS</h1>
                        <div className="row">
                            {registeredEvents.length > 0 ? (
                                registeredEvents.map((event, index) => (
                                    <div className="col-md-4 mb-4" key={index}>
                                        <div
                                            className="card event-card"
                                            onClick={() => handleForm(event.id, event )}
                                            style={{ backgroundImage: `url(${event.imagePath})` }}
                                        >
                                            <div className="card-content">
                                                <h5 className="card-title">{event.title}</h5>
                                                <p className="card-date">Ends on: {event.endDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h2 className="ml-5 text-center text-muted ">No Upcoming Events Available</h2>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>
}

export default StudentDashBoard;
