import React from "react";
import { Box, Grid, Typography, AppBar, Toolbar } from "@mui/material";
import TotalOrdersCard from "../../components/layouts/Card/TotalOrdersCard";
import TotalOrderStatus from "../../components/layouts/Card/TotalOrderStatus";
import EditOrder from "../Order/EditOrder";
import ViewportWidthSetter from "../../components/layouts/ViewportWidthSetter/ViewportWidthSetter";

function Kitchen() {
    return (
        <>
            <ViewportWidthSetter />

            <Box sx={{ minWidth: "calc(var(--vw, 1vw) * 100)", flexGrow: 1 }}>
                <AppBar
                    position="fixed"
                    sx={{
                        backgroundColor: "#6F4E37",
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{ color: "white", fontWeight: "700" }}
                        >
                            Coffee Shop Tracker List
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />{" "}
                <Box sx={{ m: "0 5%", marginTop: "64px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TotalOrdersCard />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <TotalOrderStatus />
                        </Grid>
                    </Grid>
                    <EditOrder />
                </Box>
            </Box>
        </>
    );
}

export default Kitchen;
