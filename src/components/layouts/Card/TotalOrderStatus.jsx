import React from "react";
import { useSelector } from "react-redux";
import { Box, Card, Typography, Grid, Divider } from "@mui/material";
import { CheckCircle, HourglassEmpty, DoneAll } from "@mui/icons-material";

const TotalOrderStatus = () => {
    const orders = useSelector((state) => state.orders.orders);

    const countStatus = (status) =>
        orders.filter((order) => order.status === status).length;

    const confirmedCount = countStatus("Confirmed");
    const preparingCount = countStatus("Preparing");
    const completedCount = countStatus("Completed");

    const renderCard = (title, count, icon) => (
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
                        {title}
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#333",
                            fontWeight: 700,
                        }}
                    >
                        {count}
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
                    {icon}
                </Box>
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 16px",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    Updated recently
                </Typography>
            </Box>
        </Card>
    );

    return (
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
                {renderCard(
                    "Confirmed Orders",
                    confirmedCount,
                    <CheckCircle sx={{ fontSize: 40, color: "#6F4E37" }} />
                )}
            </Grid>
            <Grid item xs={12} sm={4}>
                {renderCard(
                    "Preparing Orders",
                    preparingCount,
                    <HourglassEmpty sx={{ fontSize: 40, color: "#6F4E37" }} />
                )}
            </Grid>
            <Grid item xs={12} sm={4}>
                {renderCard(
                    "Completed Orders",
                    completedCount,
                    <DoneAll sx={{ fontSize: 40, color: "#6F4E37" }} />
                )}
            </Grid>
        </Grid>
    );
};

export default TotalOrderStatus;
