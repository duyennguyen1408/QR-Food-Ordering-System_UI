import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Grid,
    Typography,
    CircularProgress,
    MenuItem,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ImageUpload from "../../components/layouts/ImageUpload/ImageUpload";
import { createCombo } from "../../redux/slice/ComboSlice";
import { createComboDetail } from "../../redux/slice/ComboDetailSlice";
import { fetchDishes } from "../../redux/slice/DishSlice";

const ComboForm = () => {
    const dispatch = useDispatch();
    const { loading: dishesLoading } = useSelector((state) => state.dishes);
    const dishes = useSelector((state) => state.dishes.dishes);
    const { loading: comboLoading } = useSelector((state) => state.combos);
    const { loading: comboDetailLoading } = useSelector(
        (state) => state.comboDetails
    );

    const [formData, setFormData] = useState({
        comboName: "",
        comboDesc: "",
        comboPrice: "",
        comboImageUrl: "",
        comboDetails: [{ dishId: "", quantity: "" }],
    });
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
    const handleChange = (event, index) => {
        const { name, value } = event.target;
        const updatedDetails = [...formData.comboDetails];
        updatedDetails[index][name] = value;
        setFormData({ ...formData, comboDetails: updatedDetails });
    };

    const handleAddDetail = () => {
        setFormData({
            ...formData,
            comboDetails: [
                ...formData.comboDetails,
                { dishId: "", quantity: "" },
            ],
        });
    };

    const handleRemoveDetail = (index) => {
        const updatedDetails = [...formData.comboDetails];
        updatedDetails.splice(index, 1);
        setFormData({ ...formData, comboDetails: updatedDetails });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const comboData = {
                comboName: formData.comboName,
                comboDesc: formData.comboDesc,
                comboPrice: formData.comboPrice,
                comboImageUrl: formData.comboImageUrl,
            };

            const newCombo = await dispatch(createCombo(comboData));

            for (let detail of formData.comboDetails) {
                const comboDetailData = {
                    comboId: newCombo.payload.id,
                    dishId: detail.dishId,
                    quantity: parseInt(detail.quantity),
                };
                await dispatch(createComboDetail(comboDetailData));
            }

            dispatch(fetchDishes());

            setFormData({
                comboName: "",
                comboDesc: "",
                comboPrice: "",
                comboImageUrl: "",
                comboDetails: [{ dishId: "", quantity: "" }],
            });
        } catch (error) {
            console.error("Error creating combo and details:", error);
        }
    };

    useEffect(() => {
        dispatch(fetchDishes());
    }, [dispatch]);

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Add New Combo</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="comboName"
                        name="comboName"
                        label="Combo Name"
                        variant="outlined"
                        value={formData.comboName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                comboName: e.target.value,
                            })
                        }
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="comboDesc"
                        name="comboDesc"
                        label="Combo Description"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formData.comboDesc}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                comboDesc: e.target.value,
                            })
                        }
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="comboPrice"
                        name="comboPrice"
                        label="Combo Price"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formData.comboPrice}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                comboPrice: e.target.value,
                            })
                        }
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <ImageUpload
                        selectedImage={formData.comboImageUrl}
                        onImageUpload={handleImageUpload}
                        onImageRemove={handleImageRemove}
                    />
                </Grid>
                <Grid item xs={12}>
                    {formData.comboDetails.map((detail, index) => (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={5}>
                                <TextField
                                    select
                                    fullWidth
                                    id={`dishId-${index}`}
                                    name="dishId"
                                    label="Select Dish"
                                    variant="outlined"
                                    value={detail.dishId}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                >
                                    {dishes.map((dish) => (
                                        <MenuItem key={dish.id} value={dish.id}>
                                            {dish.dishTitle}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    id={`quantity-${index}`}
                                    name="quantity"
                                    label="Quantity"
                                    variant="outlined"
                                    value={detail.quantity}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={2}>
                                {index === formData.comboDetails.length - 1 && (
                                    <IconButton
                                        aria-label="add"
                                        onClick={handleAddDetail}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                )}
                                {index !== 0 && (
                                    <IconButton
                                        aria-label="remove"
                                        onClick={() =>
                                            handleRemoveDetail(index)
                                        }
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                            comboLoading || comboDetailLoading || dishesLoading
                        }
                    >
                        {comboLoading || comboDetailLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Add Combo"
                        )}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ComboForm;
