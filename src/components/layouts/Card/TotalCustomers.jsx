import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomers } from "../../../redux/slice/CustomerSlice";
import { Typography, Card, CardContent, Box, Divider } from "@mui/material";
import { Person, ArrowUpward } from "@mui/icons-material";

const TotalCustomers = () => {
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.customers);
    const isLoading = useSelector((state) => state.customers.loading);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const totalCustomers = customers ? customers.length : 0;

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
                        Total Customers
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#333",
                            fontWeight: 700,
                        }}
                    >
                        {isLoading ? "" : totalCustomers}
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
                    <Person sx={{ fontSize: 40, color: "#6F4E37" }} />
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
                    <span style={{ color: "green" }}>12%</span> to last month
                </Typography>
            </Box>
        </Card>
    );
};

export default TotalCustomers;
