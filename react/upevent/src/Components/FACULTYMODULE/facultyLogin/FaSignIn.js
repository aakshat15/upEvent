import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { loginSuccess } from "../../auth/authSlice";
import { TextField, Button, CircularProgress, IconButton, InputAdornment, Typography } from "@mui/material";
import "../../STUDENTMODULE/studentLogin/SignIn.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function FaSignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateFields = () => {
        let valid = true;
        let newErrors = { email: "", password: "" };

        if (!email.trim()) {
            newErrors.email = "Email is required!";
            valid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            newErrors.email = "Invalid email format!";
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required!";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleInputChange = (field, value) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
        if (field === "email") setEmail(value);
        if (field === "password") setPassword(value);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        setLoading(true);

        const formData = { email, password };

        try {
            const { data } = await axios.post("http://localhost:3000/faculty/faculty-signInn", formData);
            dispatch(loginSuccess({ token: data.token, user: data.user }));
            toast.success(data.message || "Sign In Successful!");
            setTimeout(() => navigate("/faculty-DashBoard"), 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    const handleGoogleSuccess = async (response) => {
        const decoded = jwtDecode(response.credential);
        const googleEmail = decoded.email;
        const googlePassword = decoded.sub; // Using Google's unique sub as password

        try {
            const { data } = await axios.post("http://localhost:3000/faculty/faculty-signInn", { email: googleEmail, password: googlePassword });

            dispatch(loginSuccess({ token: data.token, user: data.user }));
            toast.success("Google Sign-In Successful!");

            setTimeout(() => navigate("/faculty-DashBoard"), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Google Sign-In failed. Please try manually.");
        }
    };
    return (
        <div className="sign">
            <div className="container">
                <div className="form">
                    <form onSubmit={handleSignIn}>
                        <h1 className="text-center">Sign In Now</h1>
                        <h6 className="text-center" style={{ color: "#3F72AF" }}>
                            Please Enter your Details
                        </h6>

                        <div className="form-group mt-4">
                            <TextField
                                label="Email"
                                fullWidth
                                variant="outlined"
                                value={email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{ sx: { borderRadius: "10px" } }}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                variant="outlined"
                                value={password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    sx: { borderRadius: "10px" },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <Typography
                            variant="body2"
                            color="primary"
                            style={{ cursor: "pointer", textAlign: "right", marginTop: "5px" }}
                            onClick={() => navigate("/forgetPassword")}
                        >
                            Forgot Password?
                        </Typography>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            className="mt-3"
                        >
                            {loading ? <CircularProgress size={24} /> : "Sign In"}
                        </Button>
                        {/* Google Sign-In Button */}
                        <div className="mt-4 text-center">
                            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google Sign-In Failed!")} />
                        </div>
                        <Link className="btn btn-block text-dark mt-4" id="minibtn" to={"/faculty-signUp"}>
                            CREATE ACCOUNT <span className="text-primary">Sign Up</span>
                        </Link>
                    </form>
                </div>

                <div className="text">
                    <h1 className="text-center">Welcome back</h1>
                    <h5 className="text-center">You can sign in to access your existing account</h5>
                </div>
            </div>
        </div>
    );
}

export default FaSignIn;
