import React, { useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slice/UserSlice";

const EditCoffeeShop = ({
    editCoffeeShopData,
    onInputChange,
    onSave,
    onCancel,
}) => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <Box>
            <FormControl fullWidth margin="normal">
                <InputLabel id="managerId-label">Manager</InputLabel>
                <Select
                    labelId="managerId-label"
                    name="managerId"
                    value={editCoffeeShopData.managerId}
                    onChange={onInputChange}
                    required
                >
                    {users
                        .filter((user) => user.userRole === 4)
                        .map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.fullName}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <TextField
                name="coffeeShopName"
                label="Coffee Shop Name"
                value={editCoffeeShopData.coffeeShopName}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="coffeeShopDesc"
                label="Coffee Shop Description"
                value={editCoffeeShopData.coffeeShopDesc}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
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

export default EditCoffeeShop;
