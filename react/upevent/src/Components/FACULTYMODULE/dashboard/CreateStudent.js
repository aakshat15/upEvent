import { useState } from "react";
import './Dashboard.css';
import axios from "axios";
import { toast } from "react-toastify";

export default function GenerateRollNumber() {
    const [email, setEmail] = useState("");
    const [rollNumber, setRollNumber] = useState(null);
    const [loading, setLoading] = useState(false);


    // Verify email using MailboxLayer API
    const verifyEmailAPI = async (email) => {
        const apiKey = '895bb6c46fb2542fa91908971e52b3c8'; //API key
        const url = `http://apilayer.net/api/check?access_key=${apiKey}&email=${email}`;

        try {
            const response = await axios.get(url);
            console.log("MailboxLayer Response:", response.data);
            
            // Check if email is valid and not disposable
            return response.data.format_valid && response.data.smtp_check && !response.data.disposable;
        } catch (error) {
            console.error("Error verifying email:", error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        setLoading(true);

        // Verify email using MailboxLayer
        const isVerified = await verifyEmailAPI(email);
        if (!isVerified) {
            toast.error("Invalid or non-existent email!");
            setLoading(false);
            return;
        }

        // Proceed with API call if email is verified
        try {
            const res = await axios.post('http://localhost:3000/faculty/createStudent', { email });

            setTimeout(() => {
                setRollNumber(res.data.rollNumber);
                toast.success(res.data.message);
                setLoading(false);
            }, 2000);
        } catch (err) {
            toast.error("WRONG CREDENTIALS");
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="heading">Generate Student</h1>
            <div className="CreateStudentContainer">
                <div className="form-card">
                    <h2>Generate Roll Number</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Email Address</label>
                        <input 
                            placeholder="Enter your Gmail" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
        </>
    );
}
