import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDishes } from "../../../redux/slice/DishSlice";
import { Typography, Card, Box, Divider } from "@mui/material";
import { Restaurant, ArrowUpward } from "@mui/icons-material";

const TotalDishesCard = () => {
    const dispatch = useDispatch();
    const dishes = useSelector((state) => state.dishes.dishes);
    const isLoading = useSelector((state) => state.dishes.loading);

    useEffect(() => {
        dispatch(fetchDishes());
    }, [dispatch]);

    const totalDishes = dishes ? dishes.length : 0;

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
                        Total Dishes
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#333",
                            fontWeight: 700,
                        }}
                    >
                        {isLoading ? "" : totalDishes}
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
                    <Restaurant sx={{ fontSize: 40, color: "#6F4E37" }} />
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
                    Updated recently
                </Typography>
            </Box>
        </Card>
    );
};

export default TotalDishesCard;
