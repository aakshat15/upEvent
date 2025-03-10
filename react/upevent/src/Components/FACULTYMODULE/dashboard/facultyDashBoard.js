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

    const handleClick = (id) => {
        navigate(`/faculty-getDetalis/${id}`);
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
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th>TITLE</th>
                                    <th>DESCRIPTION</th>
                                    <th>ENDDATE</th>
                                    <th>LOCATION</th>
                                    <th>OWNER</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.AllEvent.length > 0 ? (
                                    state.AllEvent.map((event, index) => (
                                        <tr key={index} onClick={() => handleClick(event.id)} style={{ cursor: "pointer" }}>
                                            <td>{event.title}</td>
                                            <td>{event.description}</td>
                                            <td>{event.endDate}</td>
                                            <td>{event.location}</td>
                                            <td>{event.createByFaculty}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No events available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FacultyDashBoard;
