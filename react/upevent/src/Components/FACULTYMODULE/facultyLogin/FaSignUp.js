import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TextField, Button, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import "../../STUDENTMODULE/studentLogin/SignIn.css"; // Keep consistent styling

function FaSignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", facultyNumber: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleInputChange = (field, value) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateFields = () => {
        let valid = true;
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required!";
            valid = false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required!";
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format!";
            valid = false;
        }

        if (!formData.facultyNumber.trim()) {
            newErrors.facultyNumber = "Faculty Number is required!";
            valid = false;
        }

        if (!isGoogleUser && !formData.password.trim()) {
            newErrors.password = "Password is required!";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const signUp = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/faculty/faculty-signUp", formData);
            toast.success(res.data.message||'Check You email and Verify It');
            setTimeout(() => navigate("/faculty-signIn"), 2000);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "BAD REQUEST");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = (response) => {
        const decoded = jwtDecode(response.credential);
        setFormData({ name: decoded.name, email: decoded.email, facultyNumber: "", password: decoded.sub });
        setIsGoogleUser(true);
        toast.info("Please enter your Faculty Number to complete registration!");
    };

    return (
        <div className="sign">
            <div className="container">
                <div className="form">
                    <form onSubmit={signUp}>
                        <h1 className="text-center">Faculty Sign-Up</h1>
                        <h6 className="text-center" style={{ color: "#3F72AF" }}>Please enter your details</h6>

                        <div className="form-group mt-3">
                            <TextField
                                label="Name"
                                fullWidth
                                variant="outlined"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                error={!!errors.name} helperText={errors.name}
                            />
                        </div>

                        <div className="form-group mt-2">
                            <TextField
                                label="Email"
                                fullWidth
                                variant="outlined"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </div>

                        <div className="form-group mt-2">
                            <TextField
                                label="Faculty Number"
                                fullWidth variant="outlined"
                                value={formData.facultyNumber}
                                onChange={(e) => handleInputChange("facultyNumber", e.target.value)}
                                error={!!errors.facultyNumber}
                                helperText={errors.facultyNumber}
                            />
                        </div>

                        {!isGoogleUser && (
                            <div className="form-group mt-2">

                                <TextField
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }} />
                            </div>
                        )}
                        <div className="mt-4 text-center">


                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Sign Up"}
                            </Button>
                        </div>

                        <div className="mt-4 text-center">
                            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google Sign-In Failed!")} />
                        </div>

                        <Link className="btn btn-block text-dark mt-4" id="minibtn" to="/faculty-signIn">
                            Already have an account? <span className="text-primary">Sign In</span>
                        </Link>
                    </form>
                </div>
                <div className="text">
                    <h1 className="text-center">Welcome</h1>
                    <h5 className="text-center">You can sign up with your Faculty Number and Email account.</h5>
                </div>
            </div>
        </div>
    );
}

export default FaSignUp;