import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function GetDetalis() {

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {

                await axios.get(`http://localhost:3000/faculty/allEvents/${id}`)
                    .then((response) => {
                        console.log(response.data.student);
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

    </>
}
export default GetDetalis;