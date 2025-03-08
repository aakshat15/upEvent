import axios from "axios";
import { useReducer } from "react";
import { toast } from "react-toastify";

function CreateStudent() {

    const [state, dispatch] = useReducer(reducer, {
        email: "",
        rollNumber : ""
    });
    //USEREDUCER FUNCTION
    function reducer(state, action) {
        if (action.type == "setEmail") {
            return { ...state, email: action.payload }
        }
        else if( action.type == "setRollNumber"){
            return {...state , rollNumber : action.payload}
        }
        return state;
    }


    const createStudent = async (e) => {
        e.preventDefault();
        const email = state.email

       await axios.post("http://localhost:3000/faculty/createStudent" , {email})
        .then((response)=>{
            const rollNumber = response.data.rollNumber;
            dispatch({type : "setRollNumber" , payload : rollNumber})
            toast.success(response.data.message);
        })
        .catch((error) => {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
            dispatch({type : "setRollNumber" , payload : " "})
        })
    }
    return <>
        <div className="container">
            <h1>{state.rollNumber}</h1>
            <form onSubmit={createStudent}>
                <input className="form-group" type="email" onChange={(e) => dispatch({ type: "setEmail", payload: e.target.value })} placeholder="Enter student Email" />
                <button className="form-group" type="submit">SUBMIT</button>
            </form>
        </div>
    </>
}
export default CreateStudent;

