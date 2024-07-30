import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../redux/slice/OrderSlice";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Paper, Typography } from "@mui/material";
Chart.register(...registerables);

const TotalRevenueChart = () => {
    const dispatch = useDispatch();
    const dailyTotalPrice = useSelector(
        (state) => state.orders.dailyTotalPrice
    );

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const days = Object.keys(dailyTotalPrice).sort();
    const totalPrices = days.map((day) => dailyTotalPrice[day]);

    const data = {
        labels: days,
        datasets: [
            {
                label: "Total Price",
                data: totalPrices,
                fill: true,
                borderColor: "#B44E26",
                backgroundColor: "rgba(191, 85, 66, 0.2)",
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Total Revenue by Day",
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
            <Typography color="black">Total Revenue by Day</Typography>
            <Line data={data} options={options} />
        </Paper>
    );
};

export default TotalRevenueChart;
