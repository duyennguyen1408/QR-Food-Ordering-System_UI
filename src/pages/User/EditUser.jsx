import React from "react";
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const EditUser = ({ editUserData, onInputChange, onSave, onCancel }) => {
    return (
        <Box>
            <TextField
                name="username"
                label="Username"
                value={editUserData.username}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="password"
                label="Password"
                value={editUserData.password}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="fullName"
                label="Full Name"
                value={editUserData.fullName}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="phoneNumber"
                label="Phone Number"
                value={editUserData.phoneNumber}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal" required>
                <InputLabel>User Role</InputLabel>
                <Select
                    name="userRole"
                    value={editUserData.userRole}
                    onChange={onInputChange}
                    label="User Role"
                >
                    <MenuItem value={1}>Waiter</MenuItem>
                    <MenuItem value={2}>Barista</MenuItem>
                    <MenuItem value={3}>Baker</MenuItem>
                    <MenuItem value={4}>Manager</MenuItem>
                </Select>
            </FormControl>
            <Box display="flex" justifyContent={"space-between"} mt={2}>
                <Button
                    variant="contained"
                    sx={{
                        marginRight: "14px",
                        borderRadius: "4px",
                        backgroundColor: "black",
                        fontWeight: "500",
                    }}
                    onClick={onSave}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
                        borderRadius: "4px",
                    }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default EditUser;
