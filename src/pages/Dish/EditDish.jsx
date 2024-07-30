import React from "react";
import { Box, Button, TextField } from "@mui/material";
import ImageUpload from "../../components/layouts/ImageUpload/ImageUpload";

const EditDish = ({
    editDishData,
    selectedImage,
    onInputChange,
    onImageUpload,
    onImageRemove,
    onSave,
    onCancel,
}) => {
    return (
        <Box>
            <TextField
                name="dishTitle"
                label="Dish Title"
                value={editDishData.dishTitle}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="dishDesc"
                label="Dish Description"
                value={editDishData.dishDesc}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="dishPrice"
                label="Dish Price"
                value={editDishData.dishPrice}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <ImageUpload
                selectedImage={selectedImage}
                onImageUpload={onImageUpload}
                onImageRemove={onImageRemove}
            />
            {editDishData.itemImageUrl && !selectedImage && (
                <img
                    alt="current"
                    width={"250px"}
                    src={editDishData.itemImageUrl}
                    style={{ marginTop: "16px" }}
                />
            )}
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

export default EditDish;
