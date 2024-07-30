import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from "@mui/material";
import { fetchOrderDetails } from "../../redux/slice/OrderDetailSlice";
import { fetchComboById } from "../../redux/slice/ComboSlice";
import { fetchDishById } from "../../redux/slice/DishSlice";

const OrderDetailModal = ({ open, handleClose, orderId }) => {
    const dispatch = useDispatch();
    const { orderDetails } = useSelector((state) => state.orderDetails);
    const {
        combos,
        loading: combosLoading,
        error: combosError,
    } = useSelector((state) => state.combos);
    const {
        dishes,
        loading: dishesLoading,
        error: dishesError,
    } = useSelector((state) => state.dishes);

    const [filteredOrderDetails, setFilteredOrderDetails] = useState([]);

    useEffect(() => {
        if (open) {
            dispatch(fetchOrderDetails());
        }
    }, [dispatch, open]);

    useEffect(() => {
        const details = orderDetails.filter(
            (detail) => detail.orderId === orderId
        );
        setFilteredOrderDetails(details);

        details.forEach((detail) => {
            if (detail.comboId) {
                dispatch(fetchComboById(detail.comboId));
            }
            if (detail.dishId) {
                dispatch(fetchDishById(detail.dishId));
            }
        });
    }, [orderDetails, orderId, dispatch]);

    const getComboName = (comboId) => {
        const combo = combos.find((combo) => combo.id === comboId);
        return combo ? combo.comboName : "Combo Not Found";
    };

    const getDishName = (dishId) => {
        const dish = dishes.find((dish) => dish.id === dishId);
        return dish ? dish.dishTitle : "Dish Not Found";
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        filteredOrderDetails.forEach((detail) => {
            totalPrice += detail.price * detail.quantity;
        });
        return totalPrice.toFixed(2);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        maxWidth: 600,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        borderRadius: 2,
                        border: "1px solid #ddd",
                        color: "black",
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
                    >
                        Order Details
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            width: "70%",
                                            backgroundColor: "#f0f0f0",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <Typography variant="subtitle1">
                                            Item
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: "30%",
                                            backgroundColor: "#f0f0f0",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <Typography variant="subtitle1">
                                            Quantity
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrderDetails.map((detail, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {detail.comboId
                                                ? getComboName(detail.comboId)
                                                : getDishName(detail.dishId)}
                                        </TableCell>
                                        <TableCell>{detail.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
                    >
                        <span style={{ color: "black" }}>Total Price: </span>
                        <span style={{ color: "red" }}>
                            ${calculateTotalPrice()}
                        </span>
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderDetailModal;
