import { useState } from "react";
import  './Dashboard.css'
export default function GenerateRollNumber() {
    const [email, setEmail] = useState("");
    const [rollNumber, setRollNumber] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulating roll number generation
        setTimeout(() => {
            const generatedRoll = "RN" + Math.floor(100000 + Math.random() * 900000);
            setRollNumber(generatedRoll);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="CreateStudentContainer">
            <h1 className="heading">Generate Student</h1>
            <div className="form-card">
                <h2>Generate Roll Number</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="btn">Generate</button>
                </form>

                {loading && <div className="loader"></div>}

                {rollNumber && (
                    <div className="result-box">
                        <h3>Your Roll Number:</h3>
                        <p>{rollNumber}</p>
                    </div>
                )}
            </div>
        </div>
    );
}


// import axios from "axios";
// import { useReducer, useState } from "react";
// import { toast } from "react-toastify";
// import './CreateStudent.css';
// function CreateStudent() {

//     const [state, dispatch] = useReducer(reducer, {
//         email: "",
//         rollNumber: ""
//     });
//     const [loading, setLoading] = useState(false);

//     //USEREDUCER FUNCTION
//     function reducer(state, action) {
//         if (action.type === "setEmail") {
//             return { ...state, email: action.payload }
//         }
//         else if (action.type === "setRollNumber") {
//             return { ...state, rollNumber: action.payload }
//         }
//         return state;
//     }

//     const createStudent = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const email = state.email;
//         await axios.post("http://localhost:3000/faculty/createStudent", { email })
//             .then((response) => {
//                 const rollNumber = response.data.rollNumber;
//                 setTimeout(() => {
//                     dispatch({ type: "setRollNumber", payload: rollNumber });
//                     setLoading(false);
//                     toast.success(response.data.message);
//                 }, 2000);
//             })
//             .catch((error) => {
//                 console.log(error);
//                     dispatch({ type: "setRollNumber", payload: "" });
//                     setLoading(false);
//                     toast.error( "BAD REQUEST" || error.response.data.message );
//             })
//     }

//     return (
//         <div className="container" id="CreateStudent" >
//         <h1>Create Student</h1>
//         <form className="form" onSubmit={createStudent}>
//             <input className="form-group"
//                 type="email" 
//                 onChange={(e) => dispatch({ type: "setEmail", payload: e.target.value })} 
//                 placeholder="Enter student Email" 
//             />
//             <button className="btn btn-primary btn-block"
//                 type="submit" 
//                 disabled={loading  || !state.email.trim()}
//             >
//                 {loading ? "Loading..." : "SUBMIT"}
//             </button>
//         </form>
//             <div>
//                 <h2 className="text-light">ROLL NUMBER</h2>
//                 <h3 className="text-center">⮟</h3>
//                 <h2 id="Number">{state.rollNumber}</h2>
//             </div>
//     </div>
//     )
// }
// export default CreateStudent;