import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPayment } from "../../redux/slice/PaymentSlice";
import { Box, Typography, TextField } from "@mui/material";
import CustomizedRadios from "../layouts/CustomizedRadios/CustomizedRadios";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";

const PaymentForm = forwardRef(({ paymentSubmitted }, ref) => {
    const dispatch = useDispatch();
    const [paymentDesc, setPaymentDesc] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const orderId = useSelector((state) => state.orders.orderId);
    const loading = useSelector((state) => state.payments.loading);
    const error = useSelector((state) => state.payments.error);

    useEffect(() => {
        if (orderId) {
            const date = new Date();
            const defaultDesc = `<div>Payment for Order <strong>#${orderId}</strong> - ${date.toLocaleDateString()}</div>`;
            setPaymentDesc(defaultDesc);
        }
    }, [orderId]);

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPayment = await dispatch(
                createPayment({
                    orderId,
                    paymentDesc,
                    paymentMethod,
                })
            );
            setPaymentDesc("");
            setPaymentMethod("");

            if (paymentSubmitted) {
                paymentSubmitted();
            }
        } catch (err) {
            console.error("Error creating payment:", err);
        }
    };

    useImperativeHandle(ref, () => ({
        submitPaymentForm: () => {
            document.getElementById("paymentFormSubmit").click();
        },
    }));

    return (
        <Box
            sx={{
                maxWidth: "100%",
                color: "black",
                p: { md: "0 100px" },
                mt: 2,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    mb: 1,
                }}
            >
                Billing details
            </Typography>
            <form onSubmit={handleSubmit}>
                {loading ? (
                    <LoadingContent />
                ) : (
                    <>
                        <TextField
                            fullWidth
                            id="paymentDesc"
                            label="Payment Description"
                            variant="outlined"
                            value={paymentDesc}
                            onChange={(e) => setPaymentDesc(e.target.value)}
                            required
                            margin="normal"
                            disabled={loading}
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                p: "10px 0 10px 10px",
                            }}
                            InputProps={{
                                readOnly: true,
                            }}
                            dangerouslySetInnerHTML={{ __html: paymentDesc }}
                        />

                        <CustomizedRadios
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                        />
                        <button
                            type="submit"
                            id="paymentFormSubmit"
                            style={{ display: "none" }}
                        />
                        {error && (
                            <Typography
                                variant="body2"
                                color="error"
                                style={{ marginTop: "0.5rem" }}
                            >
                                {error}
                            </Typography>
                        )}
                    </>
                )}
            </form>
        </Box>
    );
});

export default PaymentForm;
