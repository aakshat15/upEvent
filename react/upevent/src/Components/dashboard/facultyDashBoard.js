import axios from "axios";
import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";

function FacultyDashBoard() {
    const reducer = (state, action) => {
        if (action.type === "setData") {
            return { ...state, AllEvent: action.payload }; // Fixed 'payLoad' to 'payload'
        } else {
            return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        AllEvent: [], // Ensuring it's an array initially
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:3000/faculty/allEvents");
                console.log("API Response:", response.data); // Debugging API response

                if (Array.isArray(response.data.AllEvents)) {
                    dispatch({ type: "setData", payload: response.data.AllEvents });
                } else {
                    console.error("API did not return an array:", response.data.AllEvents);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <>
            <h1>Dashboard</h1>
            <Link to={"/faculty-createEvent"}>CREATE STUDENTs</Link>
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>TITLE</th>
                        <th>DESCRIPTION</th>
                    </tr>
                </thead>
                <tbody>
                    {state.AllEvent.length > 0 ? (
                        state.AllEvent.map((event, index) => (
                            <tr key={index}>
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
        </>
    );
}

export default FacultyDashBoard;
