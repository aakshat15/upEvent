import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { Send } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post("http://localhost:3000/api/forgot-password", { email });
      setMessage("If this email is registered, a reset link has been sent.");
  } catch (err) {
    setMessage(err.response?.data?.message || "Something went wrong!");
  }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Enter your registered email to receive a password reset link.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3, borderRadius: 2 }}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Send />}
                sx={{ textTransform: "none", fontSize: "16px", fontWeight: 600, py: 1.5, borderRadius: 2 }}
              >
                Send Reset Link
              </Button>
            </motion.div>
          </Box>
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Typography variant="body2" color="success.main" sx={{ mt: 2, fontWeight: 500 }}>
                {message}
              </Typography>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ForgetPassword;