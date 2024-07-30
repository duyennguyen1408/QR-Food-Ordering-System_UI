import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDish, fetchDishes } from "../../redux/slice/DishSlice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../redux/slice/CategorySlice";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ImageUpload from "../../components/layouts/ImageUpload/ImageUpload";

const AddDish = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.tables);
    const { categories } = useSelector((state) => state.categories);
    const [formData, setFormData] = useState({
        categoryId: "",
        dishTitle: "",
        dishDesc: "",
        dishPrice: "",
        itemImageUrl: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                itemImageUrl: reader.result,
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setFormData({
            ...formData,
            itemImageUrl: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(createDish(formData));

            if (response && response.data && response.data.result === "fail") {
                const errorMessage =
                    response.data.error || "Unknown error occurred";
                console.error("Error creating dish:", errorMessage);
            } else {
                setFormData({
                    categoryId: "",
                    dishTitle: "",
                    dishDesc: "",
                    dishPrice: "",
                    itemImageUrl: "",
                });
                dispatch(fetchDishes());
            }
        } catch (error) {
            console.error("Error creating dish:", error);
        }
    };

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCancel = () => {
        navigate("/dashboard/menu-list");
    };

    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Create Dish
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={formData.categoryId}
                        onChange={handleChange}
                        name="categoryId"
                        required
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Dish Title"
                    name="dishTitle"
                    value={formData.dishTitle}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Dish Description"
                    name="dishDesc"
                    value={formData.dishDesc}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Dish Price"
                    name="dishPrice"
                    type="number"
                    value={formData.dishPrice}
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputProps={{
                        inputProps: { min: 1, step: "any" },
                    }}
                />
                <ImageUpload
                    selectedImage={formData.itemImageUrl}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2, mr: 2, backgroundColor: "black" }}
                    >
                        {loading ? "Creating..." : "Create Dish"}
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

export default AddDish;
