import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createCoffeeShop,
    fetchCoffeeShops,
} from "../../redux/slice/CoffeeShopSlice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../redux/slice/UserSlice";

const AddCoffeeShop = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, coffeeShops } = useSelector(
        (state) => state.coffeeShops
    );
    const { users } = useSelector((state) => state.users);
    const [formData, setFormData] = useState({
        managerId: "",
        coffeeShopName: "",
        coffeeShopDesc: "",
    });

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchCoffeeShops());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(createCoffeeShop(formData));

            if (response && response.data && response.data.result === "fail") {
                const errorMessage =
                    response.data.error || "Unknown error occurred";
                console.error("Error creating coffee shop:", errorMessage);
            } else {
                setFormData({
                    managerId: "",
                    coffeeShopName: "",
                    coffeeShopDesc: "",
                });
                dispatch(fetchCoffeeShops());
            }
        } catch (error) {
            console.error("Error creating coffee shop:", error);
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/coffee-shop-list");
    };

    const assignedManagerIds = coffeeShops.map((shop) => shop.managerId);

    const availableManagers = users.filter(
        (user) => user.userRole === 4 && !assignedManagerIds.includes(user.id)
    );

    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Create Coffee Shop
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="managerId-label">Manager</InputLabel>
                    <Select
                        labelId="managerId-label"
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleChange}
                        required
                    >
                        {availableManagers.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.fullName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Coffee Shop Name"
                    name="coffeeShopName"
                    value={formData.coffeeShopName}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Coffee Shop Description"
                    name="coffeeShopDesc"
                    value={formData.coffeeShopDesc}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <Box display={"flex"} justifyContent={"space-between"}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2, mr: 2, backgroundColor: "black" }}
                    >
                        {loading ? "Creating..." : "Create Coffee Shop"}
                    </Button>
                    <Button
                        variant="contained"
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

export default AddCoffeeShop;
