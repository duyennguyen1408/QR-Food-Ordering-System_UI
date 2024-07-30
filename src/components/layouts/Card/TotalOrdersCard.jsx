import React from "react";
import { useSelector } from "react-redux";
import { Card, Typography, Box, Divider } from "@mui/material";
import { ShoppingCart, ArrowUpward, ArrowDownward } from "@mui/icons-material";

const TotalOrdersCard = () => {
    const orders = useSelector((state) => state.orders.orders);
    const isLoading = useSelector((state) => state.orders.loading);
    const totalOrders = orders ? orders.length : 0;

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
                        Total Orders
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#333",
                            fontWeight: 700,
                        }}
                    >
                        {isLoading ? "" : totalOrders}
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
                    <ShoppingCart sx={{ fontSize: 40, color: "#6F4E37" }} />
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
                    <ArrowDownward
                        sx={{
                            fontSize: 16,
                            color: "red",
                            verticalAlign: "middle",
                            marginRight: 0.5,
                        }}
                    />
                    <span style={{ color: "red" }}>10%</span> to last month
                </Typography>
            </Box>
        </Card>
    );
};

export default TotalOrdersCard;
