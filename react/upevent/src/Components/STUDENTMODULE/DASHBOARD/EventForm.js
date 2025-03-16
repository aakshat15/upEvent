import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import './EventForm.css';
import { useSelector } from "react-redux";

function EventForm() {
    const { id } = useParams();
    const emailRef = useRef();
    const nameRef = useRef();
    const [EventDetalis, setEventDetalis] = useState('');
    let user = useSelector((state) => state.auth.user);
    user = JSON.parse(user);

    const [step, setStep] = useState(0);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [userData, setUserData] = useState({ name: user.name, email: user.email, branch: '', number: '' });

    const branches = ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/student/event/${id}`);
                setEventDetalis(response.data.Event);
            } catch (error) {
                console.error(error);
                alert("Error occurred while fetching event details.");
            }
        };
        fetchData();
    }, [id]);

    const displayMessage = (message, sender) => {
        const chatBox = document.getElementById("chatBox");
        if (!chatBox) return;
        const newMessage = document.createElement("div");
        newMessage.className = "message";
        newMessage.innerText = (sender === "bot" ? "# bot: " : "? you: ") + message;
        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const sendResponse = async () => {
        const input = document.getElementById("userInput");
        const message = input.value.trim();
        if (message === '') return;

        displayMessage(message, 'user');
        input.value = '';

        if (step === 0) {
            if (message > 18) {
                displayMessage("Nice to meet you! Please select your branch:", 'bot');
                branches.forEach(branch => displayMessage(branch, 'bot'));
                setStep(1);
            } else {
                displayMessage("Please enter a valid age (18 required to proceed).", 'bot');
            }
        } else if (step === 1) {
            if (branches.includes(message)) {
                setUserData(prevData => ({ ...prevData, branch: message }));
                displayMessage("Got Your Branch. Please Enter Your Mobile Number:", "bot");
                setStep(2);
            } else {
                displayMessage("Please enter a valid Branch.", 'bot');
            }
        } else if (step === 2) {
            if (/^[0-9]{10}$/.test(message)) {
                setUserData(prevData => ({ ...prevData, number: message }));
                displayMessage("Thank you! Your Registration is completed.", 'bot');
                displayMessage(`Name: ${userData.name}, Email: ${userData.email}, Branch: ${userData.branch}, Mobile: ${message}`, 'bot');
                setShowSubmitButton(true);
            } else {
                displayMessage("Please enter a valid 10-digit mobile number.", 'bot');
            }
        }
    };

    const submitDetails = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/student/event/register/${id}`, userData);
            console.log(response);
            alert("Registration submitted successfully!");
        } catch (error) {
            console.error("Error: " + error);
        }
    };

    const resetForm = () => {
        setStep(0);
        setUserData({ name: user.name, email: user.email, branch: '', number: '' });
        setShowSubmitButton(false);
        document.getElementById("chatBox").innerHTML = "";
        displayMessage(`Hello ${user.name}! Welcome to the registration chatbot. Please Enter Your Age`, "bot");
    };

    useEffect(() => {
        displayMessage(`Hello ${user.name}! Welcome to the registration chatbot. Please Enter Your Age`, "bot");
    }, []);

    return (
        <div className="EventForm">
            <div className="container mt-2">
                <div
                    className="event-details"
                    style={{ backgroundImage: `url(${EventDetalis.imagePath})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                >
                    <h1 className="titleheading">{EventDetalis.title}</h1>
                    <p className="description">{EventDetalis.description}</p>
                    <h3>{EventDetalis.endDate}</h3>
                </div>

                <div className="chat-section">
                    <div className="chat-box" id="chatBox"></div>
                    <div className="chat-input">
                        <input type="text" id="userInput" placeholder="Type your message..." />
                        <button onClick={sendResponse}>Send</button>
                    </div>
                </div>

                {showSubmitButton && (
                    <div className="submit-section">
                        <button className="submit-button" onClick={submitDetails}>Submit Details</button>
                        <button className="reset-button" onClick={resetForm}>Re-enter Details</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventForm;
