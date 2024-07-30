import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";

const LoadingContent = () => {
    return (
        <Grid container spacing={2}>
            {[...Array(8)].map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                    <Box sx={{ pt: 0.5 }}>
                        <Skeleton variant="text" width="50%" />
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default LoadingContent;
