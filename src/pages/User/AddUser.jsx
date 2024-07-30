import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUsers } from "../../redux/slice/UserSlice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.users);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        userRole: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(createUser(formData));

            if (response && response.data && response.data.result === "fail") {
                const errorMessage =
                    response.data.error || "Unknown error occurred";
                console.error("Error creating user:", errorMessage);
            } else {
                setFormData({
                    username: "",
                    password: "",
                    fullName: "",
                    phoneNumber: "",
                    userRole: "",
                });
                dispatch(fetchUsers());
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/user-list");
    };

    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Create User
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    margin="normal"
                    data-cy="username-input"
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    margin="normal"
                    data-cy="password-input"
                />
                <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    margin="normal"
                    data-cy="fullName-input"
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    margin="normal"
                    data-cy="phoneNumber-input"
                />
                <FormControl
                    fullWidth
                    margin="normal"
                    required
                    data-cy="userRole-select"
                >
                    <InputLabel>User Role</InputLabel>
                    <Select
                        name="userRole"
                        value={formData.userRole}
                        onChange={handleChange}
                        label="User Role"
                    >
                        <MenuItem value={1}>Waiter</MenuItem>
                        <MenuItem value={2}>Barista</MenuItem>
                        <MenuItem value={3}>Baker</MenuItem>
                        <MenuItem value={4}>Manager</MenuItem>
                    </Select>
                </FormControl>

                <Box display={"flex"} justifyContent={"space-between"}>
                    <Button
                        type="submit"
                        data-cy="submit-button"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2, mr: 2, backgroundColor: "black" }}
                    >
                        {loading ? "Creating..." : "Create User"}
                    </Button>
                    <Button
                        variant="contained"
                        data-cy="cancel-button"
                        onClick={handleCancel}
                        disabled={loading}
                        sx={{
                            mt: 2,
                            backgroundColor: "white",
                            border: "1px solid rgba(25, 118, 210, 0.5)",
                            color: "#1976d2;",
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
};

export default AddUser;
