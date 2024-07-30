import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTable, fetchTables } from "../../redux/slice/TableSlice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { fetchCoffeeShops } from "../../redux/slice/CoffeeShopSlice";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ImageUpload from "../../components/layouts/ImageUpload/ImageUpload";

const AddTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.tables);
    const { coffeeShops } = useSelector((state) => state.coffeeShops);
    const [formData, setFormData] = useState({
        coffeeShopId: "",
        tableName: "",
        zone: "",
        tableCapacity: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(createTable(formData));

            if (response && response.data && response.data.result === "fail") {
                const errorMessage =
                    response.data.error || "Unknown error occurred";
                console.error("Error creating table:", errorMessage);
            } else {
                setFormData({
                    coffeeShopId: "",
                    tableName: "",
                    zone: "",
                    tableCapacity: "",
                });
                dispatch(fetchTables());
            }
        } catch (error) {
            console.error("Error creating table:", error);
        }
    };

    useEffect(() => {
        dispatch(fetchCoffeeShops());
    }, [dispatch]);

    const handleCancel = () => {
        navigate("/dashboard/table-list");
    };

    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Create Table
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="coffee-shop-select-label">
                        Coffee Shop
                    </InputLabel>
                    <Select
                        labelId="coffee-shop-select-label"
                        id="coffee-shop-select"
                        value={formData.coffeeShopId}
                        onChange={handleChange}
                        name="coffeeShopId"
                        required
                    >
                        {coffeeShops.map((coffeeShop) => (
                            <MenuItem key={coffeeShop.id} value={coffeeShop.id}>
                                {coffeeShop.coffeeShopName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Table Name"
                    name="tableName"
                    value={formData.tableName}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Table Capacity"
                    name="tableCapacity"
                    value={formData.tableCapacity}
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
                        {loading ? "Creating..." : "Create Table"}
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

export default AddTable;
