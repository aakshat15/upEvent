import "./SignUp.css"
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
function SignUp() {
    return <>
        <div className="container">
            <div className="form">
                <form action="#">
                    <h2>Sign Up</h2>
                    <div className="form-group">
                        <label for="name">Name</label>
                        <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
                    </div>
                    <div className="form-group">
                        <label for="email">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label for="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Enter your password" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                    <Link  className="btn btn-block text-dark" to={'/student-signIn'}>Already have an account?<span className="text-primary">SignIn</span></Link>
                </form>
            </div>
            <div className="image">
                <img src={logo} alt="Logo" />
            </div>
        </div>
    </>
}
export default SignUp;