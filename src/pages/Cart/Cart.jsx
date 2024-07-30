import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layouts/Navbar/Navbar";
import Footer from "../../components/layouts/Footer/Footer";
import {
    Typography,
    Button,
    List,
    IconButton,
    Box,
    Fade,
    Card,
    CardMedia,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    useTheme,
    useMediaQuery,
    Container,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { removeFromCart, clearCart } from "../../redux/slice/CartSlice";
import CustomerForm from "../../components/Form/CustomerForm";
import PaymentForm from "../../components/Form/PaymentForm";
import PaymentSuccess from "../../components/layouts/PaymentSuccess/PaymentSuccess";
import ViewportWidthSetter from "../../components/layouts/ViewportWidthSetter/ViewportWidthSetter";
import CartItem from "./CartItem";
import AddOrder from "../Order/AddOrder";
const Cart = () => {
    const customerFormRef = useRef(null);
    const paymentFormRef = useRef(null);
    const addOrderRef = useRef(null);
    const handleOrderSubmitAndNextTab = () => {
        setCurrentTab((prevTab) => prevTab + 1);
        addOrderRef.current.submitOrderForm();
    };
    const { loading: customerLoading, error: customerError } = useSelector(
        (state) => state.customers
    );
    const [currentTab, setCurrentTab] = useState(0);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const items = useSelector((state) => state.cart.items);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tabs = ["Overview", "Details", "Payment"];
    const tabTitles = ["My Cart Items", "Customer Information", "Payment"];

    const handleNextTab = () => {
        setCurrentTab((prevTab) => prevTab + 1);
    };

    const handleBackTab = () => {
        setCurrentTab((prevTab) => prevTab - 1);
    };
    const handleCustomerSubmitAndNextTab = () => {
        setCurrentTab((prevTab) => prevTab + 1);
        customerFormRef.current.submitCustomerForm();
    };

    const handlePaymentSubmit = async () => {
        paymentFormRef.current.submitPaymentForm();
        navigate("/order-success");
    };

    const paymentSubmitted = () => {
        setShowPaymentSuccess(true);
    };

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart({ id }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        navigate(-1);
    };

    const totalPrice = items.reduce(
        (acc, item) =>
            acc + (item.dishPrice || item.comboPrice) * item.quantity,
        0
    );
    const theme = useTheme();
    return (
        <>
            <Navbar />
            <Container
                sx={{
                    minWidth: "calc(var(--vw, 1vw) * 100)",
                    margin: "0 auto",
                    padding: "16px",
                }}
            >
                <ViewportWidthSetter />
                <Box
                    sx={{
                        maxWidth: { xs: "95%", md: "80%" },
                        p: { md: "50px" },
                        m: "0 auto",
                    }}
                >
                    {" "}
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            position: "absolute",
                            top: 15,
                            right: 18,
                            p: 0,
                            fontSize: "2rem",
                            color: "rgb(119 119 119 / 54%);",
                        }}
                    >
                        <CloseIcon sx={{ fontSize: "35px" }} />
                    </IconButton>
                    <Typography
                        variant="h5"
                        data-testid="tab-title"
                        sx={{
                            fontWeight: 500,
                            color: "#380009",
                            textTransform: "uppercase",
                            textAlign: "center",
                        }}
                    >
                        {tabTitles[currentTab]}
                    </Typography>
                    <Box sx={{ width: "100%", mt: 4 }}>
                        <Stepper
                            activeStep={currentTab}
                            alternativeLabel
                            sx={{
                                "& .MuiStepLabel-root .Mui-completed": {
                                    color: "#380009",
                                },
                                "& .MuiStepLabel-root .Mui-active": {
                                    color: "#380009",
                                },
                            }}
                        >
                            {tabs.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                    {currentTab === 0 && (
                        <Fade in={currentTab === 0}>
                            <Box
                                sx={{
                                    mt: 1,
                                }}
                            >
                                {items.length === 0 ? (
                                    <Typography
                                        variant="body1"
                                        data-testid="empty-cart-message"
                                        sx={{
                                            padding: "1em 2em 1em 3.5em",
                                            margin: "0 0 2em",
                                            position: "relative",
                                            backgroundColor: "#f6f5f8",
                                            color: "#515151",
                                            borderTop: "3px solid #380009",
                                            mt: 2,
                                        }}
                                    >
                                        <ShoppingBagIcon
                                            sx={{
                                                position: "absolute",
                                                left: 20,
                                                top: 14,
                                            }}
                                        />
                                        Your cart is currently empty.
                                    </Typography>
                                ) : (
                                    <div>
                                        <List>
                                            {items.map((item) => (
                                                <CartItem
                                                    item={item}
                                                    handleRemoveFromCart={
                                                        handleRemoveFromCart
                                                    }
                                                />
                                            ))}
                                        </List>
                                        <Box
                                            sx={{
                                                p: "20px 20px 30px",
                                                bgcolor: "white",
                                                borderTop: "1.5px solid #ccc",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    margin: "0 0 20px",
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    data-testid="total-price"
                                                    color="black"
                                                    fontWeight="700"
                                                >
                                                    Total:
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: "red",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    ${totalPrice.toFixed(2)}
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    onClick={handleClearCart}
                                                    sx={{
                                                        fontWeight: "700",
                                                        fontSize: "16px",
                                                        lineHeight: "22px",
                                                        textAlign: "center",
                                                        color: "#000",
                                                        bgcolor: "#fff",
                                                        border: "1px solid #000",
                                                        p: "12px 5px",
                                                        borderRadius: "10px",
                                                        textDecoration: "none",
                                                        width: "-webkit-calc((100% - 18px) / 2)",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "black",
                                                            color: "white",
                                                        },
                                                    }}
                                                >
                                                    Clear All
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    data-testid="next-button"
                                                    onClick={
                                                        handleOrderSubmitAndNextTab
                                                    }
                                                    sx={{
                                                        fontWeight: "700",
                                                        fontSize: "16px",
                                                        lineHeight: "22px",
                                                        textAlign: "center",
                                                        color: "#fff",
                                                        bgcolor: "#380009",
                                                        border: "1px solid #000",
                                                        p: "12px 5px",
                                                        borderRadius: "10px",
                                                        textDecoration: "none",
                                                        width: "-webkit-calc((100% - 18px) / 2)",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "black",
                                                            color: "white",
                                                        },
                                                    }}
                                                >
                                                    Next
                                                </Button>
                                                <AddOrder
                                                    ref={addOrderRef}
                                                    totalPrice={totalPrice}
                                                />
                                            </Box>
                                        </Box>
                                    </div>
                                )}
                            </Box>
                        </Fade>
                    )}
                    {currentTab === 1 && (
                        <Fade in={currentTab === 1}>
                            <Box>
                                <CustomerForm ref={customerFormRef} />
                                <Box
                                    sx={{
                                        p: "20px 20px 30px",
                                        bgcolor: "white",
                                        borderTop: "1.5px solid #ccc",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            margin: "0 0 20px",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="black"
                                            fontWeight="700"
                                        >
                                            Total:
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "red",
                                                fontWeight: "700",
                                            }}
                                        >
                                            ${totalPrice.toFixed(2)}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={handleBackTab}
                                            sx={{
                                                fontWeight: "700",
                                                fontSize: "16px",
                                                lineHeight: "22px",
                                                textAlign: "center",
                                                color: "#000",
                                                bgcolor: "#fff",
                                                border: "1px solid #000",
                                                p: "12px 5px",
                                                borderRadius: "10px",
                                                textDecoration: "none",
                                                width: "-webkit-calc((100% - 18px) / 2)",
                                                "&:hover": {
                                                    backgroundColor: "black",
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="contained"
                                            data-testid="next-button"
                                            disabled={customerLoading}
                                            onClick={
                                                handleCustomerSubmitAndNextTab
                                            }
                                            sx={{
                                                fontWeight: "700",
                                                fontSize: "16px",
                                                lineHeight: "22px",
                                                textAlign: "center",
                                                color: "#fff",
                                                bgcolor: "#380009",
                                                border: "1px solid #000",
                                                p: "12px 5px",
                                                borderRadius: "10px",
                                                textDecoration: "none",
                                                width: "-webkit-calc((100% - 18px) / 2)",
                                                "&:hover": {
                                                    backgroundColor: "black",
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            Next
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                    {currentTab === 2 && (
                        <Fade in={currentTab === 2}>
                            <Box>
                                <PaymentForm
                                    ref={paymentFormRef}
                                    paymentSubmitted={paymentSubmitted}
                                />

                                <Box
                                    sx={{
                                        p: { md: "20px 20px 30px" },
                                        bgcolor: "white",
                                        borderTop: "1.5px solid #ccc",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "100%",
                                            p: "20px 20px 30px",
                                            bgcolor: "white",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                margin: "0 0 20px",
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                color="black"
                                                fontWeight="700"
                                            >
                                                Total:
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: "red",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                ${totalPrice.toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={handleBackTab}
                                                sx={{
                                                    fontWeight: "700",
                                                    fontSize: "16px",
                                                    lineHeight: "22px",
                                                    textAlign: "center",
                                                    color: "#000",
                                                    bgcolor: "#fff",
                                                    border: "1px solid #000",
                                                    p: "12px 5px",
                                                    borderRadius: "10px",
                                                    textDecoration: "none",
                                                    width: "-webkit-calc((100% - 18px) / 2)",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "black",
                                                        color: "white",
                                                    },
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                variant="contained"
                                                data-testid="payment-submit-button"
                                                onClick={handlePaymentSubmit}
                                                sx={{
                                                    fontWeight: "700",
                                                    fontSize: "16px",
                                                    lineHeight: "22px",
                                                    textAlign: "center",
                                                    color: "#fff",
                                                    bgcolor: "#380009",
                                                    border: "1px solid #000",
                                                    p: "12px 5px",
                                                    borderRadius: "10px",
                                                    textDecoration: "none",
                                                    width: "-webkit-calc((100% - 18px) / 2)",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "black",
                                                        color: "white",
                                                    },
                                                }}
                                            >
                                                Place Order
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                    {/* Show Payment Success Component if payment is successful */}
                    {showPaymentSuccess && <PaymentSuccess />}
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default Cart;
