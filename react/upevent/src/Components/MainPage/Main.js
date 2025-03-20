import { Link } from "react-router-dom";
import "./Main.css"


function Main() {
    // const navigate = useNavigate();
    return <>
        <div className="container main" id="main">
        <h1 className="brand">UpEvent</h1>
        <p className="lead">Effortlessly register for events, receive real-time updates, and manage your bookings.</p>
        <div className="role-card d-flex justify-content-center gap-3 mt-4">
            <Link  to="/student-signUp"  id="btn">Get Started → As Student</Link>
            <Link  to="/faculty-signUp"  id="btn">Get Started → As Faculty</Link>
        </div>
    </div>
    </>
}
export default Main;