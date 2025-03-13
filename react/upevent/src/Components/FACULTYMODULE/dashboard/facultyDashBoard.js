import axios from "axios";
import { useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function FacultyDashBoard() {
    const navigate = useNavigate();

    const reducer = (state, action) => {
        switch (action.type) {
            case "setData":
                return { ...state, AllEvent: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        AllEvent: [],
    });

    // Function to fetch events
    const fetchEvents = async (url) => {
        try {
            const response = await axios.get(url);
            if (Array.isArray(response.data.AllEvents)) {
                dispatch({ type: "setData", payload: response.data.AllEvents });
            } else {
                console.error("API did not return an array:", response.data.AllEvents);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    // Fetch all events on initial load
    useEffect(() => {
        handleAllEventClick();
    }, []);

    // Fetch "My Events" when the button is clicked
    const handleMyEventClick = () => {
        fetchEvents("http://localhost:3000/faculty/myEvents");
    };

    const handleAllEventClick = () => {
        fetchEvents("http://localhost:3000/faculty/allEvents");
    };

    const handleClick = (id,event) => {
        navigate(`/faculty-getDetalis/${id}`,{ state: { eventData: event } });
    };

    // BURGER FUNCTION
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
    };
    //BURGER CLOSER FUNCTION
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const sidebar = document.getElementById('sidebar');
            const menuIcon = document.querySelector('.menu-icon');

            if (sidebar && menuIcon && !sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        };

        document.addEventListener('click', handleOutsideClick);
    }, []);

    return (
        <>
            <div className="dashboard">
                <div className="container-fluid p-0">
                    {/* .BURGER */}
                    <div className="menu-icon" onClick={toggleSidebar}>☰</div>

                    {/* SIDEBAR */}
                    <div className="sidebar" id="sidebar">
                        <h2>EVENTS</h2>
                        <ul>
                            <li><Link to="/faculty-createEvent">CREATE EVENT</Link></li>
                            <li><Link to="/faculty-createStudent">REGISTER STUDENT</Link></li>
                            <li><Link onClick={handleAllEventClick}>ALL RUNNING EVENTS</Link></li>
                            <li><Link onClick={handleMyEventClick}>OWN CREATED EVENTS</Link></li>
                        </ul>
                        <button className="btn btn-primary">Sign out</button>
                    </div>


                    <div className="content">
                        <h1>FACULTY DASHBOARD</h1>
                        <input type="text" className="form-control" placeholder="Search" />
                        <div className="data-container">
                            <div className="upComingcontainer mt-4">
                                <h1>UPCOMING EVENT</h1>
                                <div className="row">
                                    {state.AllEvent
                                        .filter(event => new Date(event.endDate).getTime() >= Date.now()) // Filtering events based on end date
                                        .map((event, index) => (
                                            <div className="col-md-4 mb-4" key={index}>
                                                <div className="card" onClick={() => handleClick(event.id,event)} style={{ cursor: "pointer" }}>
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
                                    {state.AllEvent
                                        .filter(event => new Date(event.endDate).getTime() <= Date.now()) // Filtering events based on end date
                                        .map((event, index) => (
                                            <div className="col-md-4 mb-4" key={index}>
                                                <div className="card" onClick={() => handleClick(event.id,event)} style={{ cursor: "pointer" }}>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default FacultyDashBoard;
