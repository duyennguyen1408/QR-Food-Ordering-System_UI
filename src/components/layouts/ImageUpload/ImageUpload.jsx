import React, { useState } from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

const ImageUpload = ({ selectedImage, onImageUpload, onImageRemove }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setImagePreview(imageUrl);
                onImageUpload(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setImagePreview(imageUrl);
                onImageUpload(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    return (
        <Box display="flex" alignItems="center" sx={{ m: "20px 0" }}>
            <Box
                border={dragging ? "2px dashed #007bff" : "2px dashed #ccc"}
                borderRadius={4}
                width={300}
                height={150}
                display="flex"
                alignItems="center"
                justifyContent="center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    cursor: "pointer",
                    position: "relative",
                    marginRight: "20px",
                }}
            >
                <input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    style={{
                        display: "none",
                    }}
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="contained-button-file"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        color: dragging ? "#007bff" : "#ccc",
                        cursor: "pointer",
                    }}
                >
                    <AddIcon style={{ fontSize: 48 }} />
                    <Typography>
                        Drag & Drop or Click to Upload Image
                    </Typography>
                </label>
            </Box>

            {imagePreview && (
                <Box position="relative" display="inline-block">
                    <img
                        alt="Selected Preview"
                        width={"250px"}
                        src={imagePreview}
                    />
                    <IconButton
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                        }}
                        onClick={() => {
                            setImagePreview(null);
                            onImageRemove();
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default ImageUpload;
