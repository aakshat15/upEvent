import axios from "axios";
import { useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import dashBoard from "./Dashboard.css"
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
        handleAllEventClick()
    }, []);

    // Fetch "My Events" when the button is clicked
    const handleMyEventClick = () => {
        fetchEvents("http://localhost:3000/faculty/myEvents"); // API for faculty's own events
    };

    const handleAllEventClick = () => {
        fetchEvents("http://localhost:3000/faculty/allEvents"); // API for faculty's All events
    };

    const handleClick = (id) => {
        navigate(`/faculty-getDetalis/${id}`);
    };

    return (
        <>
            <div className={dashBoard}>
                <div class="container-fluid p-0">
                    <div class="menu-icon" onclick="toggleSidebar()">☰</div>
                    <div class="sidebar" id="sidebar">
                        <h2>EVENTS</h2>
                        <ul>
                            <li>ALL RUNING EVENTS</li>
                            <li>REGISTER</li>
                            <li>OWN CREATED EVENT</li>
                            <li>ALL RUNING EVENTS</li>
                        </ul>
                        <button class="btn btn-primary">Sign out</button>
                    </div>
                    <div class="content">
                        <h1>FACULTY DASHBOARD</h1>
                        <input type="text" class="form-control" placeholder="Search" />
                        <table class="table table-bordered table-hover">
                            <thead class="thead-light">
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2">No events available.</td>
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
