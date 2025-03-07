import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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


    const handleClick = (id)=>{
        navigate(`/student-eventForm/${id}`)
    }
    return <>
        <h1>StudentDashBoard</h1>
        <table className="table table-bordered table-striped">
            <thead className="thead-dark" >
                <th>id</th>
                <th>TITILE</th>
                <th>description</th>
                <th>EndDate</th>
            </thead>
            <tbody>
                {data.map((event, index) => (
                    <tr onClick={()=>handleClick(event.id)} key={index}>
                        <td>{event.id}</td>
                        <td>{event.title}</td>
                        <td>{event.description}</td>
                        <td>{event.endDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
}
export default StudentDashBoard;