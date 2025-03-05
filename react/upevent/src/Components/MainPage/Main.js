import { Link } from "react-router-dom";
import "./Main.css"


function Main() {
    // const navigate = useNavigate();
    return <>
        <div className="container hero" id="container">
        <h1 className="brand">UpEvent</h1>
        <p className="lead">Effortlessly register for events, receive real-time updates, and manage your bookings.</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
            <Link  to="/student-signUp" className="btn btn-primary btn-custom" id="btn">Get Started → As Student</Link>
            <Link  to="/faculty-signUp" className="btn btn-outline-secondary btn-custom" id="btn">Get Started → As Faculty</Link>
        </div>
    </div>
    </>
}
export default Main;