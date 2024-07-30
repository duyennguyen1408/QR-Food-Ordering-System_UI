import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import TotalOrderChart from "../../components/layouts/Chart/TotalOrderChart";
import TotalRevenueChart from "../../components/layouts/Chart/TotalRevenueChart";
import TotalRevenueCard from "../../components/layouts/Card/TotalRevenueCard";
import TotalDishesCard from "../../components/layouts/Card/TotalDishesCard";
import TotalOrdersCard from "../../components/layouts/Card/TotalOrdersCard";
import TotalCustomers from "../../components/layouts/Card/TotalCustomers";
import TotalPayments from "../../components/layouts/Chart/TotalPayments";

function Dashboard() {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ m: "0 20px" }}>
                Coffee Shop Analytics Dashboard
            </Typography>
            <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ p: "16px 24px 0 24px" }}
            >
                <Grid item xs={4}>
                    <Grid sx={{ height: "100%" }}>
                        <TotalPayments />
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                        <Grid item xs={6} sx={{ p: "0 20px" }}>
                            <TotalRevenueCard />
                            <TotalDishesCard />
                        </Grid>
                        <Grid item xs={6} sx={{ p: "0 20px" }}>
                            <TotalCustomers />
                            <TotalOrdersCard />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                        <Grid item xs={12} sx={{ mb: 2 }}>
                            <TotalRevenueChart sx={{ height: "500px" }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TotalOrderChart sx={{ height: "500px" }} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
