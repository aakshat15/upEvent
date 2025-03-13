import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function GetDetalis() {

    const { id } = useParams();
    //IT IS USE TO PASS DATA FROM COMPONENT TO NAVIGATE COMPONANT
    const location = useLocation();
    const eventData = location.state?.eventData;

    const[students , setstudents] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {

                await axios.get(`http://localhost:3000/faculty/allEvents/${id}`)
                    .then((response) => {
                        students = response.data.student
                        console.log(students);
                        console.log(eventData);

                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
            catch (ERROR) {
                console.log(ERROR);
            }
        }
        fetchData();
    }, [])

    return <>
        <h1>This is Detalis Page</h1>
        <div className="container mt-5">
            <div className="row">
                {/* EVENT DETALIS SECTION */}
                <div className="col-md-5">
                    <div className="card-body">
                        <h2 className="card-title">{eventData.title}</h2>
                        <p className="card-title">{eventData.description}</p>
                        <h4 className="card-title">{eventData.endDate}</h4>
                        <h4 className="card-title">{eventData.location}</h4>
                    </div>
                </div>
                <div class="col-md-8">
                    <h4 class="mb-3">Registered Users</h4>
                    <input type="text" id="search" class="form-control mb-3" placeholder="Search users..." />
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead class="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody id="userTable">
                               {
                                students.
                                map((student , index) => (
                                    <tr>
                                        <td></td>
                                    </tr>
                                ))
                               }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default GetDetalis;