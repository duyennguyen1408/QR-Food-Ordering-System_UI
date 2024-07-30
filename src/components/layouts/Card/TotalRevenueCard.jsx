import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../redux/slice/OrderSlice";
import { Typography, Card, Box, Divider } from "@mui/material";
import { MonetizationOn, ArrowUpward } from "@mui/icons-material";

const TotalRevenueCard = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);
    const isLoading = useSelector((state) => state.orders.loading);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        if (orders.length) {
            const revenue = calculateTotalRevenue(orders);
            setTotalRevenue(revenue);
        }
    }, [orders]);

    const calculateTotalRevenue = (orders) => {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const totalRevenue = orders.reduce((total, order) => {
            const orderDate = new Date(order.orderDate);
            if (orderDate >= thirtyDaysAgo && orderDate <= now) {
                return total + parseFloat(order.totalPrice);
            }
            return total;
        }, 0);

        return totalRevenue;
    };

    return (
        <Card
            elevation={3}
            sx={{
                maxWidth: "400px",
                margin: "16px auto",
                borderRadius: 2,
                overflow: "visible",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                    }}
                >
                    <Typography
                        variant="button"
                        sx={{
                            color: "#6F4E37",
                            fontWeight: 700,
                            fontSize: "18px",
                        }}
                    >
                        Total Revenue
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#333",
                            fontWeight: 700,
                        }}
                    >
                        {isLoading ? "" : `$${totalRevenue.toFixed(2)}`}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        backgroundColor: "#e0d4ce",
                        borderRadius: "50%",
                        padding: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MonetizationOn sx={{ fontSize: 40, color: "#6F4E37" }} />
                </Box>
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 16px",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    <ArrowUpward
                        sx={{
                            fontSize: 16,
                            color: "green",
                            verticalAlign: "middle",
                            marginRight: 0.5,
                        }}
                    />
                    <span style={{ color: "green" }}>8%</span> to last month
                </Typography>
            </Box>
        </Card>
    );
};

export default TotalRevenueCard;
