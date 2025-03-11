import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png"
import "./dashBoard.css"
function StudentDashBoard() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {

            await axios.get("http://localhost:3000/student/student-dashboard")
                .then((res) => {
                    setData(res.data.EVENT);
                })
                .catch((error) => {
                    console.log(error);
                    alert("SERVER ERROR")
                })
        }
        fetchData();
    }, [])


    const handleClick = (id) => {
        navigate(`/student-eventForm/${id}`)
    }
    return <>
    <div className="studentDeshboard">
        <nav className="navbar">
            <a className="navbar-brand" id="nav" href="#">
                <img src={logo} width="30" height="30" className="d-inline-block align-top mr-2" alt="Logo" />
                <span>Bootstrap</span>
            </a>
            {/* <div className="ml-auto"> */}
                <button className="btn btn-primary">Action Button</button>
            {/* </div> */}
        </nav>
            <table className="table table-hover table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>TITLE</th>
                        <th>DESCRIPTION</th>
                        <th>END DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((event, index) => (
                        <tr onClick={() => handleClick(event.id)} key={index}>
                            <td>{event.title}</td>
                            <td>{event.description}</td>
                            <td>{event.endDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}
export default StudentDashBoard;