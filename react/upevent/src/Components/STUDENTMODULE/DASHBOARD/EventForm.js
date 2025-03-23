import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./EventForm.css";
import { useSelector } from "react-redux";

function EventForm() {
    const { id } = useParams();
    const location = useLocation();
    const activeTab = location.state?.activeTab;
    console.log(activeTab);

    const [eventDetails, setEventDetails] = useState({});
    let user = useSelector((state) => state.auth.user);
    // user = JSON.parse(user);
    const [timeLeft, setTimeLeft] = useState(null);


    const [step, setStep] = useState(0);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const branches = ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"];
    const [userData, setUserData] = useState({ name: user.name, email: user.email, branch: '', number: '' });
    useEffect(() => {
        displayMessage(`Hello ${user.name}! Welcome to the registration chatbot. Please Enter Your Age`, "bot");
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/student/event/${id}`);
                console.log(response.data.Event);
                setEventDetails(response.data.Event);
                const targetDate = new Date(response.data.Event.endDate).getTime();
                setTimeLeft(targetDate - Date.now());
            } catch (error) {
                console.error(error);
                alert("Error fetching event details.");
            }
        };
        fetchData();
    }, [id]);


    //FOR THE CHATS
    const displayMessage = (message, sender) => {
        const chatBox = document.getElementById("chatBox");
        if (!chatBox) return;
        const newMessage = document.createElement("div");
        newMessage.className = "message";
        newMessage.innerText = (sender === "bot" ? "🤖 bot: " : "🙍🏻‍♂️ you: ") + message;
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





    //FOR THE COUNTER
    useEffect(() => {
        if (timeLeft !== null) {
            const interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1000);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timeLeft]);


    const getTimeComponents = (milliseconds) => {
        if (milliseconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
        return { days, hours, minutes, seconds };
    };

    const { days, hours, minutes, seconds } = getTimeComponents(timeLeft);
    //for the detalis of date in event
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return (
        <div className="EventForm">
            <div className="event-banner" style={{ background: `url(${eventDetails.imagePath}) center/cover no-repeat` }}>
                <div className="overlay"></div>
                <div className="Eventcontent">
                    <h4>{new Date(eventDetails.endDate).toLocaleDateString('en-US', options)}- {eventDetails.location}</h4>
                    <h1>{eventDetails.title}</h1>

                    {/* IF UPCOMING ONLY */}
                    {activeTab==='upcoming' && (       
                        <a className="btn" onClick={() => document.getElementById("chat-section").scrollIntoView({ behavior: 'smooth' })}>
                        Register Now
                    </a>
                    )}
                    {activeTab==='past' && (
                    <h4 className="text-light bg-danger text-center">ENDED</h4>
                    )}
                    {activeTab==='registered' && (
                    <h4 className="text-light bg-success text-center">REGISTERED</h4>
                    )}
                </div>
            </div>
            <h2 className="heading">Event Countdown</h2>
            <div className="countdown-container">
                <div className="countdown-box">
                    <span id="days">{days}</span>
                    <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-box">
                    <span id="hours">{hours}</span>
                    <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-box">
                    <span id="minutes">{minutes}</span>
                    <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-box">
                    <span id="secounds">{seconds}</span>
                    <div className="countdown-label">seconds</div>
                </div>
            </div>
            {/* Description */}
            <div class="event-description-container">
                <div class="event-text">
                    <h1 className="heading">Event Description</h1>
                    <p>{eventDetails.description}</p>
                </div>
            </div>
            {activeTab === 'upcoming' && (
                <div className="chat-section" id="chat-section">
                    <h1 className="heading">Chat With Event Assistant</h1>
                    <div className="chat-box" id="chatBox"></div>
                    <div className="chat-input">
                        <input type="text" id="userInput" placeholder="Type your message..." />
                        <button className="send-btn" onClick={sendResponse}>Send</button>
                    </div>

                    {showSubmitButton && (
                        <div className="submit-section">
                            <button className="submit-btn" onClick={submitDetails}>Submit Details</button>
                            <button className="reenter-btn" onClick={resetForm}>Re-enter Details</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default EventForm;
