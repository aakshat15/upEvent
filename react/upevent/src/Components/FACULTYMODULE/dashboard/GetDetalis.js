import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./GetDetalis.css";

function GetDetails() {
    const { id } = useParams();
    const location = useLocation();
    const eventData = location.state?.eventData;

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/faculty/allEvents/${id}`);
                setStudents(response.data.student);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchData();
    }, [id]);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };

    return (
        <div className="getDetails-container">
            <div className="left-section">
                <div className="event-bannerr" style={{ background: `url(${eventData.imagePath}) center/cover no-repeat` }}>
                    <div className="overlay"></div>
                    <div className="Eventcontent">
                        <h4>{new Date(eventData.endDate).toLocaleDateString('en-US', options)} - {eventData.location}</h4>
                        <h1>{eventData.title}</h1>
                    </div>
                </div>
                <div className="event-description">
                    <p>{eventData.description}</p>
                </div>
            </div>
            <div className="right-section">
                <div className="table card">
                    <h4 className="mb-3 text-center">Registered Users</h4>
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-header">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Branch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students
                                    .filter(student => student.name.toLowerCase().includes(search.toLowerCase()))
                                    .map((student, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.number}</td>
                                            <td>{student.branch}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetDetails;
