import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPayment } from "../../redux/slice/PaymentSlice";
import {
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const AddPayment = () => {
    const dispatch = useDispatch();
    const [paymentData, setPaymentData] = useState({
        orderId: "",
        paymentDesc: "",
        paymentMethod: "",
        status: "in progress",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createPayment(paymentData));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Create Payment
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Order ID"
                            name="orderId"
                            value={paymentData.orderId}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Payment Description"
                            name="paymentDesc"
                            value={paymentData.paymentDesc}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Payment Method"
                            name="paymentMethod"
                            value={paymentData.paymentMethod}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={paymentData.status}
                                onChange={handleChange}
                                name="status"
                                required
                            >
                                <MenuItem value="in progress">
                                    In Progress
                                </MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Create Payment
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AddPayment;
