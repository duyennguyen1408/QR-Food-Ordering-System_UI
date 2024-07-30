import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../../redux/slice/OrderSlice";
import { Bar } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
const TotalOrderChart = () => {
    const dispatch = useDispatch();
    const dailyOrders = useSelector((state) => state.orders.dailyOrders);

    useEffect(() => {
        dispatch(fetchOrders()); // Fetch daily orders
    }, [dispatch]);

    // Extract days and order counts from dailyOrders object
    const days = Object.keys(dailyOrders);
    const orderCounts = Object.values(dailyOrders);

    // Prepare data for Chart.js
    const data = {
        labels: days,
        datasets: [
            {
                label: "Total Orders",
                data: orderCounts,
                backgroundColor: "#DB8B7B",
                BorderColor: "rgba(153,102,255,1)",
                borderWidth: 1,
                borderRadius: 20,
                borderSkipped: false,
                barPercentage: 0.25,
                categoryPercentage: 0.5,
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
                text: "Total Orders by Day",
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
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
            <Typography>Total Orders by Day</Typography>
            <Bar data={data} options={options} />
        </Paper>
    );
};

export default TotalOrderChart;
