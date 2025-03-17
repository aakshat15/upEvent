import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import './GetDetalis.css'
function GetDetails() {
    const { id } = useParams();
    const location = useLocation();
    const eventData = location.state?.eventData;

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            console.log(eventData);
            
            try {
                const response = await axios.get(`http://localhost:3000/faculty/allEvents/${id}`);
                setStudents(response.data.student);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="getDetalis">
            <div className="row ">
                {/* Event Details Section */}
                <div className="col-lg-5">
                    <div className="card Eventcard">
                        <img src={eventData.imagePath} alt="Event" className="img-fluid rounded mb-3" />
                        <h2 className="fw-bold">{eventData?.title}</h2>
                        <p>{eventData?.description}</p>
                        <h5><strong>End Date:</strong> {eventData?.endDate}</h5>
                        <h5><strong>Location:</strong> {eventData?.location}</h5>
                    </div>
                </div>
                {/* Registered Users Section */}
                <div className="col-lg-7">
                    <div className="table card ">
                        <h4 className="mb-3 text-center">Registered Users</h4>
                        <input 
                            type="text" 
                            className="form-control mb-3" 
                            placeholder="Search users..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>BRANCH</th>
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
        </div>
    );
}

export default GetDetails;