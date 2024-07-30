import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchOrders,
    updateOrderStatus,
    orderReceived,
} from "../../redux/slice/OrderSlice";
import OrderDetailModal from "../OrderDetail/OrderDetailModal";
import DeleteOrder from "./DeleteOrder";
import socket from "../../context/socketConfig";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Alert,
    Slide,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Collapse,
    Stack,
} from "@mui/material";
import { fetchTables } from "../../redux/slice/TableSlice";

const EditOrder = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);
    const orderStatus = useSelector((state) => state.orders.status);
    const { tables } = useSelector((state) => state.tables);

    const [alertMessage, setAlertMessage] = useState(null);
    const [stepperFinished, setStepperFinished] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteOrderId, setDeleteOrderId] = useState(null);

    const handleViewOrderDetail = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleDeleteOrderClose = () => {
        setDeleteOrderId(null);
    };

    useEffect(() => {
        if (orderStatus === "idle") {
            dispatch(fetchOrders());
        }
        if (tables.length === 0) {
            dispatch(fetchTables());
        }

        socket.on("order_status_updated", handleOrderStatusUpdated);
        socket.on("new_order", handleNewOrderReceived);

        return () => {
            socket.off("order_status_updated", handleOrderStatusUpdated);
            socket.off("new_order", handleNewOrderReceived);
        };
    }, [orderStatus, tables.length, dispatch]);

    const handleNewOrderReceived = (notification) => {
        if (notification.type === "NEW_ORDER") {
            dispatch(orderReceived(notification.data));
            setAlertMessage(`New order received!`);
            setTimeout(() => {
                setAlertMessage(null);
            }, 8000);
        }
    };

    const handleOrderStatusUpdated = (data) => {
        const updatedOrders = orders.map((order) =>
            order.id === data.orderId
                ? { ...order, status: data.status }
                : order
        );
        dispatch(
            updateOrderStatus({
                orderId: data.orderId,
                status: data.status,
            })
        );

        if (data.status === "Completed") {
            setStepperFinished(true);
        }
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        dispatch(
            updateOrderStatus({
                orderId,
                status: newStatus,
            })
        );

        socket.emit("order_status_updated", {
            orderId,
            status: newStatus,
        });
    };

    const getStatusIndex = (status) => {
        switch (status) {
            case "Confirmed":
                return 0;
            case "Preparing":
                return 1;
            case "Completed":
                return 2;
            default:
                return 0;
        }
    };

    const getTableName = (tableId) => {
        const table = tables.find((table) => table.id === tableId);
        return table ? table.tableName : "Unknown Table";
    };

    return (
        <Box>
            <Slide
                direction="down"
                in={!!alertMessage}
                mountOnEnter
                unmountOnExit
            >
                <Alert severity="success" onClose={() => setAlertMessage(null)}>
                    {alertMessage}
                </Alert>
            </Slide>

            <Typography variant="h4" gutterBottom>
                Orders
            </Typography>
            <Grid container spacing={2}>
                {orders.map((order) => (
                    <Grid item xs={12} sm={6} md={3} key={order.id}>
                        <Card sx={{ m: 1 }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "700" }}
                                >
                                    Order ID: #{order.id}
                                </Typography>
                                <Typography>
                                    Table: {getTableName(order.tableId)}
                                </Typography>
                                <Typography>
                                    Total Price: ${order.totalPrice}
                                </Typography>
                                <Stepper
                                    activeStep={getStatusIndex(order.status)}
                                    completed={stepperFinished}
                                    sx={{
                                        m: "10px 0",
                                        "& .MuiStepLabel-root .Mui-completed": {
                                            color: "#7c4b52",
                                        },
                                        "& .MuiStepLabel-root .Mui-active": {
                                            color: "#7c4b52",
                                        },
                                    }}
                                >
                                    <Step key="Confirmed">
                                        <StepLabel>Confirmed</StepLabel>
                                    </Step>

                                    <Step key="Completed">
                                        <StepLabel>Completed</StepLabel>
                                    </Step>
                                </Stepper>
                                <Collapse in={order.status === "Confirmed"}>
                                    <Box mt={1}>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#7c4b52" }}
                                            onClick={() =>
                                                handleUpdateStatus(
                                                    order.id,
                                                    "Preparing"
                                                )
                                            }
                                            disabled={orderStatus === "loading"}
                                        >
                                            Confirm
                                        </Button>
                                    </Box>
                                </Collapse>
                                <Collapse in={order.status === "Preparing"}>
                                    <Box mt={1}>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#7c4b52" }}
                                            onClick={() =>
                                                handleUpdateStatus(
                                                    order.id,
                                                    "Completed"
                                                )
                                            }
                                            disabled={orderStatus === "loading"}
                                        >
                                            Completed
                                        </Button>
                                    </Box>
                                </Collapse>
                                <Collapse in={order.status === "Completed"}>
                                    <Box mt={1}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#7c4b52",
                                                color: "#fff",
                                            }}
                                            onClick={() =>
                                                setDeleteOrderId(order.id)
                                            }
                                            disabled={orderStatus === "loading"}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Collapse>
                                <Stack direction="row" spacing={2} mt={2}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderColor: "#7c4b52",
                                            color: "#7c4b52",
                                        }}
                                        onClick={() =>
                                            handleViewOrderDetail(order)
                                        }
                                    >
                                        View Order Detail
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedOrder && (
                <OrderDetailModal
                    open={true}
                    handleClose={handleCloseModal}
                    orderId={selectedOrder.id}
                />
            )}
            {deleteOrderId && (
                <DeleteOrder
                    orderId={deleteOrderId}
                    onClose={handleDeleteOrderClose}
                />
            )}
        </Box>
    );
};

export default EditOrder;
