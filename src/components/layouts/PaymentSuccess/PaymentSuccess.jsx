import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../redux/slice/CartSlice";
import PaymentSuccessIcon from "../../Icon/PaymentSuccessIcon";
import ViewportWidthSetter from "../ViewportWidthSetter/ViewportWidthSetter";

const PaymentSuccess = () => {
    const [showContent, setShowContent] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBackToMenu = () => {
        dispatch(clearCart());
        navigate(-2);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Container
            style={{
                textAlign: "center",
                minWidth: "calc(var(--vw, 1vw) * 100)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
            }}
        >
            <ViewportWidthSetter />
            <PaymentSuccessIcon />
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "2rem",
                    mt: 4,
                }}
            >
                {showContent && (
                    <>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                        >
                            Order Received!
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Thank you for your order. We appreciate your
                            business!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleBackToMenu}
                            style={{
                                marginTop: "1rem",
                                backgroundColor: "black",
                            }}
                        >
                            Back to Menu
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default PaymentSuccess;
