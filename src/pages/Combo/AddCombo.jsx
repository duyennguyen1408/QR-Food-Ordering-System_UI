import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCombo, fetchCombos } from "../../redux/slice/ComboSlice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../components/layouts/ImageUpload/ImageUpload";

const AddCombo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.combos);
    const [formData, setFormData] = useState({
        comboName: "",
        comboDesc: "",
        comboPrice: "",
        comboImageUrl: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                comboImageUrl: reader.result,
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setFormData({
            ...formData,
            comboImageUrl: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(createCombo(formData));

            if (response && response.data && response.data.result === "fail") {
                const errorMessage =
                    response.data.error || "Unknown error occurred";
                console.error("Error creating combo:", errorMessage);
            } else {
                setFormData({
                    comboName: "",
                    comboDesc: "",
                    comboPrice: "",
                    comboImageUrl: "",
                });
                dispatch(fetchCombos());
            }
        } catch (error) {
            console.error("Error creating combos:", error);
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/combo-table");
    };
    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Create Combo
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Combo Name"
                    name="comboName"
                    value={formData.comboName}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Combo Description"
                    name="comboDesc"
                    value={formData.comboDesc}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Combo Price"
                    name="comboPrice"
                    type="number"
                    value={formData.comboPrice}
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputProps={{
                        inputProps: { min: 1, step: "any" },
                    }}
                />
                <ImageUpload
                    selectedImage={formData.comboImageUrl}
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
                        {loading ? "Creating..." : "Create Combo"}
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

export default AddCombo;
