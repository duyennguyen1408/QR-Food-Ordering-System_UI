import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Modal,
    CircularProgress,
    Box,
    CardMedia,
    Grid,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { fetchComboDetails } from "../../redux/slice/ComboDetailSlice";
import { fetchCombos } from "../../redux/slice/ComboSlice";
import { fetchDishes } from "../../redux/slice/DishSlice";
import { addToCart } from "../../redux/slice/CartSlice";

const ComboDetailModal = ({ comboId, closeModal, isOpen, comboData }) => {
    const dispatch = useDispatch();
    const { comboDetails, loading } = useSelector(
        (state) => state.comboDetails
    );
    const { combos } = useSelector((state) => state.combos);
    const dishes = useSelector((state) => state.dishes.dishes);
    const cartItems = useSelector((state) => state.cart.items);

    const [comboImage, setComboImage] = useState(null);
    const [comboPrice, setComboPrice] = useState(null);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchCombos());
            dispatch(fetchComboDetails());
            dispatch(fetchDishes());
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (isOpen && combos.length > 0) {
            const combo = combos.find((combo) => combo.id === comboId);
            if (combo) {
                setComboImage(combo.comboImageUrl);
                setComboPrice(combo.comboPrice);
            }
        }
    }, [combos, comboId, isOpen]);

    useEffect(() => {
        if (isOpen && comboDetails.length > 0) {
            const comboDetailsFiltered = comboDetails.filter(
                (comboDetail) => comboDetail.comboId === comboId
            );
        }
    }, [dispatch, comboDetails, comboId, isOpen]);

    const handleClose = () => {
        closeModal();
    };

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: comboId,
                type: "combo",
                comboName: comboData.comboName,
                comboPrice: comboData.comboPrice,
                comboImageUrl: comboImage,
                quantity: 1,
            })
        );
        handleClose();
    };

    const comboDetailsFiltered = comboDetails.filter(
        (comboDetail) => comboDetail.comboId === comboId
    );
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="combo-comboDetail-modal"
            aria-describedby="modal-displaying-combo-comboDetail"
        >
            <Box
                sx={{
                    color: "black",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "75%", md: "60%" },
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                        {comboImage && (
                            <CardMedia
                                component="img"
                                image={comboImage}
                                alt={comboData.comboName}
                                sx={{ borderRadius: 2, width: "100%" }}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ fontWeight: "bold", m: "15px 0" }}
                        >
                            This combo includes:
                        </Typography>
                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : comboDetailsFiltered.length > 0 ? (
                            <List
                                sx={{
                                    border: "1.5px solid #ccc",
                                    borderRadius: 2,
                                }}
                            >
                                {comboDetailsFiltered.map((comboDetail) => {
                                    const dish = dishes.find(
                                        (dish) => dish.id === comboDetail.dishId
                                    );
                                    return (
                                        <ListItem
                                            key={comboDetail.id}
                                            sx={{
                                                ml: 5,
                                                p: 0,
                                                listStyleType: "disc",
                                                display: "list-item",
                                            }}
                                        >
                                            <ListItemText
                                                primary={`${
                                                    dish
                                                        ? dish.dishTitle
                                                        : "Unknown Dish"
                                                } X ${comboDetail.quantity}`}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        ) : (
                            <Typography variant="body1">
                                No combo details found.
                            </Typography>
                        )}
                        {comboPrice && (
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    m: "15px 0",
                                    color: "red",
                                    fontWeight: "bold",
                                }}
                            >
                                Price: ${comboPrice}
                            </Typography>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{
                                    fontWeight: "700",
                                    fontSize: "16px",
                                    lineHeight: "22px",
                                    textAlign: "center",
                                    color: "#000",
                                    bgcolor: "#fff",
                                    border: "1px solid #000",
                                    p: "12px 5px",
                                    borderRadius: "10px",
                                    textDecoration: "none",
                                    width: "-webkit-calc((100% - 18px) / 2)",
                                    "&:hover": {
                                        backgroundColor: "black",
                                        color: "white",
                                    },
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleAddToCart}
                                sx={{
                                    fontWeight: "700",
                                    fontSize: "16px",
                                    lineHeight: "22px",
                                    textAlign: "center",
                                    color: "#fff",
                                    bgcolor: "#380009",
                                    border: "1px solid #000",
                                    p: "12px 5px",
                                    borderRadius: "10px",
                                    textDecoration: "none",
                                    width: "-webkit-calc((100% - 18px) / 2)",
                                    "&:hover": {
                                        backgroundColor: "black",
                                        color: "white",
                                    },
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default ComboDetailModal;
