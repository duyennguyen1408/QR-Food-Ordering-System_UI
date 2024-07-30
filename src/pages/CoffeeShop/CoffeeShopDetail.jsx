import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCoffeeShopById } from "../../redux/slice/CoffeeShopSlice";
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Grid,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Banner2 from "../../assets/banner2.jpg";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";
import ViewportWidthSetter from "../../components/layouts/ViewportWidthSetter/ViewportWidthSetter";
const CoffeeShopDetail = () => {
    const dispatch = useDispatch();
    const { coffeeShops, loading, error } = useSelector(
        (state) => state.coffeeShops
    );
    const { coffeeShopId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [isVisible, setIsVisible] = useState(false);
    const [hasScrolledDown, setHasScrolledDown] = useState(false);

    useEffect(() => {
        dispatch(fetchCoffeeShopById(coffeeShopId));
    }, [dispatch, coffeeShopId]);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll =
                document.body.scrollTop || document.documentElement.scrollTop;
            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const scrolled = winScroll / height;

            if (scrolled > 0.1) {
                setIsVisible(true);
                setHasScrolledDown(true);
            } else if (!hasScrolledDown) {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasScrolledDown]);

    const coffeeShop = coffeeShops.find(
        (item) => item.id === Number(coffeeShopId)
    );

    if (loading) {
        return <LoadingContent />;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    if (!coffeeShop) {
        return <Typography>No coffee shop found.</Typography>;
    }

    return (
        <Container
            sx={{
                minWidth: "calc(var(--vw, 1vw) * 100)",
                padding: {
                    xs: "40px",
                    md: "50px",
                    lg: "100px",
                },
                backgroundColor: "#fcf6f1",
                mt: { xs: 30, md: 25 },
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.1s ease-in-out",
            }}
        >
            <ViewportWidthSetter />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box>
                    <Grid container spacing={2}>
                        {!isMobile && (
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mr: 5,
                                        "& img": {
                                            maxWidth: "100%",
                                            height: "auto",
                                            transition:
                                                "transform 0.3s ease-in-out",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                            },
                                        },
                                    }}
                                >
                                    <img
                                        src={Banner2}
                                        alt="Coffee Shop"
                                        style={{ width: "100%" }}
                                    />
                                </Box>
                            </Grid>
                        )}
                        <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: 2,
                                    fontSize: "20px",
                                    color: "#7c4b52",
                                    fontWeight: 500,
                                    fontFamily: "Roboto",
                                    padding: "0 0 0 45px",
                                    display: "inline-block",
                                    position: "relative",
                                    zIndex: 1,
                                    "&:before": {
                                        position: "absolute",
                                        content: '""',
                                        left: 0,
                                        bottom: "7px",
                                        width: "30px",
                                        height: "2px",
                                        background: "#7c4b52",
                                    },
                                }}
                            >
                                About Us
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: "22px",
                                    color: "#000000",
                                    fontWeight: 600,
                                    fontFamily: "Roboto",
                                    mb: 2,
                                }}
                            >
                                {coffeeShop.coffeeShopName}
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#666",
                                    fontSize: "16px",
                                }}
                            >
                                {coffeeShop.coffeeShopDesc}
                            </Typography>
                        </Grid>
                        {isMobile && (
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        "& img": {
                                            transition:
                                                "transform 0.3s ease-in-out",
                                            "&:hover": {
                                                transform: "scale(1.05)",
                                            },
                                        },
                                    }}
                                >
                                    <img
                                        src={Banner2}
                                        alt="Coffee Shop"
                                        style={{ maxWidth: "100%" }}
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </motion.div>
        </Container>
    );
};

export default CoffeeShopDetail;
