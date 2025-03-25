import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Box } from "@mui/material";
import "./EventForm.css";
import { toast } from "react-toastify";

function EventForm() {
    //HOOKS
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.state?.activeTab;
    let user = useSelector((state) => state.auth.user);
    user = JSON.stringify(user); // Convert to JSON string before parsing
    user = JSON.parse(user);
    //STATES
    const [eventDetails, setEventDetails] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [chatMode, setChatMode] = useState("");
    const [step, setStep] = useState(0);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const branches = ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics"];
    const [userData, setUserData] = useState({ name: user.name, email: user.email, branch: '', number: '' });


    useEffect(() => {
        displayMessage(
            chatMode === "registration"
                ? `Hello ${user.name}! Welcome to the registration chatbot. Please enter your age.`
                : `Hello ${user.name}! Welcome to the AI assistant. How can I assist you?`,
            "bot"
        );

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/student/event/${id}`);
                setEventDetails(response.data.Event);
                const targetDate = new Date(response.data.Event.endDate).getTime();
                setTimeLeft(targetDate - Date.now());
            } catch (error) {
                console.error(error);
                alert("Error fetching event details.");
            }
        };
        fetchData();
    }, [id, chatMode]);

    // Function to Display Messages in Chatbox
    const displayMessage = (message, sender) => {
        const chatBox = document.getElementById("chatBox");
        if (!chatBox) return;
        const newMessage = document.createElement("div");
        newMessage.className = "message";
        newMessage.innerText = (sender === "bot" ? "🤖 Bot: " : "🙍🏻‍♂️ You: ") + message;
        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Registration Chatbot Logic
    const handleRegistrationChat = (message) => {
        if (step === 0) {
            if (message > 18) {
                displayMessage("Nice to meet you! Please select your branch:", "bot");
                branches.forEach(branch => displayMessage(branch, "bot"));
                setStep(1);
            } else {
                displayMessage("Please enter a valid age (18 required to proceed).", "bot");
            }
        } else if (step === 1) {
            if (branches.includes(message)) {
                setUserData(prevData => ({ ...prevData, branch: message }));
                displayMessage("Got your branch. Please enter your mobile number:", "bot");
                setStep(2);
            } else {
                displayMessage("Please enter a valid branch.", "bot");
            }
        } else if (step === 2) {
            if (/^[0-9]{10}$/.test(message)) {
                setUserData(prevData => ({ ...prevData, number: message }));
                displayMessage("Thank you! Your registration is completed.", "bot");
                displayMessage(`Name: ${userData.name}, Email: ${userData.email}, Branch: ${userData.branch}, Mobile: ${message}`, "bot");
                setShowSubmitButton(true);
            } else {
                displayMessage("Please enter a valid 10-digit mobile number.", "bot");
            }
        }
    };

    // Using Gemini API
    const handleAIChat = async (message) => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA75hlL3UjmsAJ7rJ_ZngBQSHMpb1KVFIA`,
                {
                    contents: [
                        {
                            parts: [
                                { text: `Event Description: ${eventDetails.description}` },
                                { text: `User Query: ${message}` }
                            ]
                        }
                    ]
                }
            );

            const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";
            displayMessage(aiResponse, "bot");
        } catch (error) {
            console.error("Error fetching AI response:", error);
            displayMessage("Error fetching AI response. Try again later.", "bot");
        }
    };

    //FOR THE FILED
    const sendResponse = () => {
        const input = document.getElementById("userInput");
        const message = input.value.trim();
        if (message === "") return;

        displayMessage(message, "user");
        input.value = "";

        if (chatMode === "registration") {
            handleRegistrationChat(message);
        } else {
            handleAIChat(message);
        }
    };

    // Submit Registration Details
    const submitDetails = async () => {
        try {
            await axios.post(`http://localhost:3000/student/event/register/${id}`, userData);
            toast.success("Registration submitted successfully!");
            navigate('/student-DashBoard')
        } catch (error) {
            console.error("Error: " + error);
        }
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

    //CONVERTING TIME FOR SHOW
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
                    {activeTab === 'upcoming' && (
                        <a
                            className={`btn ${chatMode === 'registration' ? 'disabled' : ''}`}
                            onClick={() => {
                                if (chatMode !== 'registration') {
                                    document.getElementById("chat-section").scrollIntoView({ behavior: "smooth" });
                                    setChatMode("registration");
                                    document.getElementById("chatBox").innerHTML = "";
                                }
                            }}
                            style={{ pointerEvents: chatMode === 'registration' ? 'none' : 'auto', opacity: chatMode === 'registration' ? 0.5 : 1 }}
                        >
                            Register Now
                        </a>
                    )}
                    {activeTab === 'past' && (
                        <h4 className="text-light bg-danger text-center">ENDED</h4>
                    )}
                    {activeTab === 'registered' && (
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
            <div className="chat-section" id="chat-section">
                <h1 className="heading">Chat With Event Assistant</h1>
                <Box sx={{ textAlign: "center", p: 2 }}>
                    <Button
                        variant={chatMode === "ai" ? "contained" : "outlined"}
                        onClick={() => {
                            setChatMode("ai");
                            document.getElementById("chatBox").innerHTML = "";
                        }}
                        sx={{ mr: 1 }}
                    >
                        AI Chat
                    </Button>
                    {activeTab === 'upcoming' && (
                        <Button
                            variant={chatMode === "registration" ? "contained" : "outlined"}
                            onClick={() => {
                                setChatMode("registration");
                                document.getElementById("chatBox").innerHTML = "";
                            }}
                        >
                            Registration Chatbot
                        </Button>
                    )}
                </Box>

                <div className="chat-box" id="chatBox"></div>
                <div className="chat-input">
                    <input type="text" id="userInput" placeholder="Type your message..." />
                    <button className="send-btn" onClick={sendResponse}>Send</button>
                </div>

                {showSubmitButton && chatMode === "registration" && (
                    <div className="submit-section">
                        <button className="submit-btn" onClick={submitDetails}>Submit Details</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventForm;
