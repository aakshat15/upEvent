import axios from "axios";
import { useReducer, useState } from "react";
import { toast } from "react-toastify";

function CreateStudent() {

    const [state, dispatch] = useReducer(reducer, {
        email: "",
        rollNumber: ""
    });
    const [loading, setLoading] = useState(false);

    //USEREDUCER FUNCTION
    function reducer(state, action) {
        if (action.type === "setEmail") {
            return { ...state, email: action.payload }
        }
        else if (action.type === "setRollNumber") {
            return { ...state, rollNumber: action.payload }
        }
        return state;
    }

    const createStudent = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = state.email;
        await axios.post("http://localhost:3000/faculty/createStudent", { email })
            .then((response) => {
                const rollNumber = response.data.rollNumber;
                setTimeout(() => {
                    dispatch({ type: "setRollNumber", payload: rollNumber });
                    setLoading(false);
                    toast.success(response.data.message);
                }, 2000);
            })
            .catch((error) => {
                setTimeout(() => {
                    dispatch({ type: "setRollNumber", payload: "" });
                    setLoading(false);
                    toast.error(error.response.data.message);
                }, 2000);
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Create Student</h2>
                <form onSubmit={createStudent} className="space-y-4">
                    <input 
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        type="email" 
                        onChange={(e) => dispatch({ type: "setEmail", payload: e.target.value })} 
                        placeholder="Enter student Email" 
                    />
                    <button 
                        className={`w-full text-white p-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 transition'}`} 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "SUBMIT"}
                    </button>
                </form>
                {state.rollNumber && (
                    <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                        <p className="text-green-700 font-semibold">Roll Number:</p>
                        <p className="text-lg font-bold">{state.rollNumber}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default CreateStudent;