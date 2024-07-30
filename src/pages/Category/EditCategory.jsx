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

const EditCategory = ({
    editCategoryData,
    onInputChange,
    onSave,
    onCancel,
    coffeeShops,
}) => {
    return (
        <Box>
            <FormControl fullWidth margin="normal">
                <InputLabel id="coffee-shop-select-label">
                    Coffee Shop
                </InputLabel>
                <Select
                    labelId="coffee-shop-select-label"
                    name="coffeeShopId"
                    value={editCategoryData.coffeeShopId}
                    onChange={onInputChange}
                    fullWidth
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
                name="categoryName"
                label="Category Name"
                value={editCategoryData.categoryName}
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

export default EditCategory;
