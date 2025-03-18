import axios from "axios";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

function AllEvents() {
    const navigate = useNavigate();


    //USE REDUCER FOR THE PLACE OF STATE
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

    //CALL API FOR THE DATA
    useEffect(() => {
        fatchEvent()
    }, [])
    const fatchEvent = ()=>{
        axios.get("http://localhost:3000/faculty/allEvents")
        .then((res)=>{
            // console.log(res.data.AllEvents);
            dispatch({type:'setData' , payload: res.data.AllEvents})
        })
        .catch((err)=>{
            console.log(err);
            alert('SOMETHING WENT WROUNG')
        })

    }

    //ON CLICK ANY ONE EVENT 
    const handleClick = (id, event) => {
        navigate(`/faculty-getDetalis/${id}`, { state: { eventData: event } });
    };
    return <>
            <h1 className="heading">FACULTY DASHBOARD</h1>
            <div className="data-container">
            <input type="text" className="form-control" id="search" placeholder="Search" />
                <div className="upComingcontainer">
                    <h1 className="midHeading" >UPCOMING EVENT</h1>
                    <div className="row">
                    {state.AllEvent && state.AllEvent.length > 0 ? (
                        state.AllEvent
                            .filter(event => new Date(event.endDate).getTime() >= Date.now()) // Filtering events based on end date
                            .map((event, index) => (
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
                        ): (
                                <h2 className="ml-5 text-center text-muted">No Events Available</h2>
                        )}
                    </div>

                </div>
                <h1 className="midHeading">RECENT END EVENT</h1>
                <div className="endcontainer mt-4">
                    <div className="row">
                        {state.AllEvent && state.AllEvent.length > 0 ? (
                        state.AllEvent
                            .filter(event => new Date(event.endDate).getTime() <= Date.now()) // Filtering events based on end date
                            .map((event, index) => (
                                <div className="col-md-4 mb-4" key={index}>
                                <div
                                  className="card event-card"
                                  onClick={() => handleClick(event.id, event)}
                                  style={{ backgroundImage: `url(${event.imagePath})` }}
                                >
                                  <div ></div>
                                  <div className="card-content">
                                    <h5 className="card-title">{event.title}</h5>
                                    <p className="card-date">Ends on: {event.endDate}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                        ): (
                                <h2 className="ml-5 text-center text-muted">No Events Available</h2>
                        )}
                    </div>

                </div>
            </div>
    </>
}

export default AllEvents;