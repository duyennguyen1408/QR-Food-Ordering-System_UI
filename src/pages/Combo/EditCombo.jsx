import React from "react";
import { Box, Button, TextField } from "@mui/material";
import ImageUpload from "../../components/layouts/ImageUpload/ImageUpload";

const EditCombo = ({
    editComboData,
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
                name="comboName"
                label="Combo Name"
                value={editComboData.comboName}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="comboDesc"
                label="Combo Description"
                value={editComboData.comboDesc}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="comboPrice"
                label="Combo Price"
                value={editComboData.comboPrice}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <ImageUpload
                selectedImage={selectedImage}
                onImageUpload={onImageUpload}
                onImageRemove={onImageRemove}
            />
            {editComboData.comboImageUrl && !selectedImage && (
                <img
                    alt="current"
                    width={"250px"}
                    src={editComboData.comboImageUrl}
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

export default EditCombo;
