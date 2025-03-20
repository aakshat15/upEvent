import axios from "axios";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

function AllEvents() {
    const navigate = useNavigate();

    // Reducer function
    const reducer = (state, action) => {
        switch (action.type) {
            case "setData":
                const currentTime = Date.now();
                return {
                    ...state,
                    upcomingEvents: action.payload.filter(event => new Date(event.endDate).getTime() >= currentTime),
                    endedEvents: action.payload.filter(event => new Date(event.endDate).getTime() < currentTime),
                };
            default:
                return state;
        }
    };

    // state
    const [state, dispatch] = useReducer(reducer, {
        upcomingEvents: [],
        endedEvents: [],
    });

    // Fetch events
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:3000/faculty/myEvents");
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
                <input type="text" className="form-control" id="search" placeholder="Search" />
                
                {/* Upcoming Events */}
                <div className="upComingcontainer">
                    <h1 className="midHeading text-center">UPCOMING EVENTS</h1>
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
                            <h2 className="ml-5 text-center text-muted ">No Upcoming Events Available</h2>
                        )}
                    </div>
                </div>

                {/* Ended Events */}
                <h1 className="midHeading text-center">RECENT ENDED EVENTS</h1>
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
