import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayments } from "../../../redux/slice/PaymentSlice";
import { Doughnut } from "react-chartjs-2";
import { Typography, Paper, CircularProgress } from "@mui/material";

const TotalPayments = () => {
    const dispatch = useDispatch();
    const { payments, loading, error } = useSelector((state) => state.payments);

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    const processPaymentsData = () => {
        let labels = [];
        let otcPayments = 0;
        let bankTransferPayments = 0;

        if (payments && payments.length > 0) {
            payments.forEach((payment) => {
                if (payment.paymentMethod === "OTC") {
                    otcPayments++;
                } else if (payment.paymentMethod === "bankTransfer") {
                    bankTransferPayments++;
                }
            });

            labels = ["OTC", "Bank Transfer"];
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: "Daily Total Payments by Method",
                    backgroundColor: ["#B14C32", "#471C13"],
                    borderColor: [
                        "rgba(255, 159, 64, 1)",
                        "rgba(75, 192, 192, 1)",
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: [
                        "rgba(255, 159, 64, 0.4)",
                        "rgba(75, 192, 192, 0.4)",
                    ],
                    hoverBorderColor: [
                        "rgba(255, 159, 64, 1)",
                        "rgba(75, 192, 192, 1)",
                    ],
                    data: [otcPayments, bankTransferPayments],
                },
            ],
        };
    };

    const chartData = processPaymentsData();

    return (
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6" gutterBottom>
                Daily Total Payments by Method
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography variant="body1" color="error">
                    Error: {error}
                </Typography>
            ) : (
                <Doughnut
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            title: {
                                display: true,
                                text: "Daily Total Payments by Method",
                            },
                        },
                    }}
                />
            )}
        </Paper>
    );
};

export default TotalPayments;
