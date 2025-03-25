import axios from "axios";
import { useEffect, useReducer, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash"; // Import lodash for debounce

function AllEvents() {
    const navigate = useNavigate();

    // Reducer function
    const reducer = (state, action) => {
        switch (action.type) {
            case "setData":
                const currentTime = Date.now();
                return {
                    ...state,
                    allEvents: action.payload,
                    upcomingEvents: action.payload.filter(event => new Date(event.endDate).getTime() >= currentTime),
                    endedEvents: action.payload.filter(event => new Date(event.endDate).getTime() < currentTime),
                };
            case "setFilteredEvents":
                return {
                    ...state,
                    upcomingEvents: action.payload.filter(event => new Date(event.endDate).getTime() >= Date.now()),
                    endedEvents: action.payload.filter(event => new Date(event.endDate).getTime() < Date.now()),
                };
            default:
                return state;
        }
    };

    // State
    const [state, dispatch] = useReducer(reducer, {
        allEvents: [],
        upcomingEvents: [],
        endedEvents: [],
    });

    const [searchQuery, setSearchQuery] = useState("");

    // Debounced search function
    const debouncedSearch = useCallback(
        _.debounce((query) => {
            if (query.trim() === "") {
                dispatch({ type: "setFilteredEvents", payload: state.allEvents });
            } else {
                const filteredEvents = state.allEvents.filter((event) =>
                    event.title.toLowerCase().includes(query.toLowerCase())
                );
                dispatch({ type: "setFilteredEvents", payload: filteredEvents });
            }
        }, 500), // 500ms delay
        [state.allEvents]
    );

    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Fetch events
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:3000/faculty/allEvents");
            dispatch({ type: "setData", payload: res.data.AllEvents });
        } catch (error) {
            console.error(error);
            alert("Something went wrong while fetching events");
        }
    };

    // Handle event click
    const handleClick = (id, event) => {
        navigate(`/faculty-getDetalis/${id}`, { state: { eventData: event } });
    };

    return (
        <>
            <h1 className="heading">FACULTY DASHBOARD</h1>
            <div className="data-container">
                {/* Search Bar */}
                <input 
                    type="text" 
                    className="form-control" 
                    id="search" 
                    placeholder="Search events..." 
                    value={searchQuery} 
                    onChange={handleSearchChange} 
                />

                {/* Upcoming Events */}
                <div className="upComingcontainer">
                    <h3 className="midHeading text-center">UPCOMING EVENTS</h3>
                    <div className="row">
                        {state.upcomingEvents.length > 0 ? (
                            state.upcomingEvents.map((event, index) => (
                                <div className="col-md-4 mb-4" key={index}>
                                    <div 
                                        className="card event-card" 
                                        onClick={() => handleClick(event.id, event)} 
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
                            <h2 className="ml-5 text-center text-muted">No Upcoming Events Available</h2>
                        )}
                    </div>
                </div>

                {/* Ended Events */}
                <h3 className="midHeading text-center">RECENT ENDED EVENTS</h3>
                <div className="endcontainer mt-4">
                    <div className="row">
                        {state.endedEvents.length > 0 ? (
                            state.endedEvents.map((event, index) => (
                                <div className="col-md-4 mb-4" key={index}>
                                    <div 
                                        className="card event-card" 
                                        onClick={() => handleClick(event.id, event)} 
                                        style={{ backgroundImage: `url(${event.imagePath})` }}
                                    >
                                        <div className="card-content">
                                            <h5 className="card-title">{event.title}</h5>
                                            <p className="card-date">Ended on: {event.endDate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h2 className="ml-5 text-center text-muted">No Ended Events Available</h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllEvents;
