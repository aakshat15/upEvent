import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { TextField, Button, Card, CardContent, Typography, Container } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function EditEvent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { eventData } = location.state || {};

    const [formData, setFormData] = useState({
        title: eventData?.title || "",
        endDate: eventData?.endDate ? dayjs(eventData.endDate) : null,
        imagePath: eventData?.imagePath || "",
    });

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Date Picker change
    const handleDateChange = (newValue) => {
        setFormData({ ...formData, endDate: newValue });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/faculty/updateEvent/${eventData.id}`, {
                ...formData,
                endDate: formData.endDate ? formData.endDate.format("YYYY-MM-DD") : "",
            });
            alert("Event updated successfully!");
            navigate("/faculty-dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed to update the event.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card sx={{ p: 3, boxShadow: 5, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                        Edit Event
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Event Title"
                            name="title"
                            variant="outlined"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End Date"
                                value={formData.endDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                                sx={{ mb: 3, width: "100%" }}
                            />
                        </LocalizationProvider>

                        <TextField
                            fullWidth
                            label="Image URL"
                            name="imagePath"
                            variant="outlined"
                            value={formData.imagePath}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                mt: 2,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                py: 1.5,
                                borderRadius: 2,
                            }}
                        >
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default EditEvent;
