import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Alert, Paper } from "@mui/material";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

    const validateForm = () => {
        let isValid = true;
        let newErrors = { password: "", confirmPassword: "" };

        if (password.length < 4) {
            newErrors.password = "Password must be at least 4 characters.";
            isValid = false;
        }

        if (confirmPassword === "") {
            newErrors.confirmPassword = "Confirm password is required.";
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!validateForm()) return;

        try {
            const response = await axios.post(`http://localhost:3001/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired link!");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Reset Your Password
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Enter your new password below.
                </Typography>
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
                    >
                        Reset Password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default ResetPassword;
