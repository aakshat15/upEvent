import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import AllEvents from "./AllEvents";
import MyEvents from "./MyEvents";
import CreateEvent from "./CreateEvent";
import CreateStudent from "./CreateStudent";
import { useDispatch } from "react-redux";
import { logOut } from "../../auth/authSlice";

function FacultyDashBoard() {
    //HOOKS
    const dispatch = useDispatch();

    //STATES
    const[activeComponent , setActiveComponent] = useState('allEvents');

    // BURGER FUNCTION
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
    };
    //BURGER CLOSER FUNCTION
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const sidebar = document.getElementById('sidebar');
            const menuIcon = document.querySelector('.menu-icon');

            if (sidebar && menuIcon && !sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        };

        document.addEventListener('click', handleOutsideClick);
    }, []);

    const signOut = () => {
        const confirmLogout = window.confirm("Are you sure you want to sign out?");
        if (confirmLogout) {
            dispatch(logOut())
        } else {
            console.log("Sign-out canceled");
        }
    };
    return (
        <>
            <div className="dashboard">
                <div className="container-fluid p-0">
                    {/* .BURGER */}
                    <div className="menu-icon" onClick={toggleSidebar}>☰</div>

                    {/* SIDEBAR */}
                    <div className="sidebar" id="sidebar">
                        <ul>
                            <li><Link  onClick={() => setActiveComponent("CreateEvent")}>CREATE EVENT</Link></li>
                            <li>
                                <Link onClick={() => setActiveComponent("RegsiterStudent")}>REGISTER STUDENT</Link>
                            </li>
                            <li>
                                <Link onClick={() => setActiveComponent("allEvents")}>ALL RUNNING EVENTS</Link>
                            </li>
                            <li>
                                <Link onClick={()=> setActiveComponent('myEvents')}>OWN CREATED EVENTS</Link>
                            </li>
                        </ul>
                        <button className="btn btn-primary" onClick={signOut}>Sign out</button>
                    </div>


                    {/* Conditional Rendering */}
                    <div className="content">
                        {activeComponent === "CreateEvent" && <CreateEvent />}
                        {activeComponent === "RegsiterStudent" && <CreateStudent />}
                        {activeComponent === "allEvents" && <AllEvents />}
                        {activeComponent === "myEvents" && <MyEvents />}
                    </div>
                </div>
            </div>

        </>
    );
}

export default FacultyDashBoard;