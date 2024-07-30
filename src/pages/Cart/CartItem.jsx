import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CartItem = ({ item, handleRemoveFromCart }) => {
    return (
        <Card
            key={item.id}
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                mb: 2,
                padding: 1,
                bgcolor: "background.paper",
                boxShadow: 5,
                "&:hover": {
                    backgroundColor: "#f1f1f1",
                },
            }}
        >
            <CardMedia
                component="img"
                sx={{
                    maxWidth: 120,
                    maxHeight: 120,
                    borderRadius: 2,
                    ml: 1,
                }}
                image={item.itemImageUrl || item.comboImageUrl}
                alt={item.dishTitle || item.comboName}
            />
            <CardContent
                sx={{
                    flex: 1,
                    position: "relative",
                    p: "24px 16px",
                }}
            >
                <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveFromCart(item.id)}
                    sx={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                    }}
                >
                    <DeleteIcon />
                </IconButton>
                <Typography variant="h6" component="div">
                    {item.dishTitle || item.comboName}
                </Typography>

                <Typography variant="body1" color="red" fontWeight="bold">
                    ${item.dishPrice || item.comboPrice}
                </Typography>
                <Typography>Quantity: {item.quantity}</Typography>
            </CardContent>
        </Card>
    );
};

export default CartItem;
