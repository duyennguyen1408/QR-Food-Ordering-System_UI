import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, orderReceived } from "../../redux/slice/OrderSlice";
import socket from "../../context/socketConfig";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";
import Pagination from "../../components/layouts/Pagination/Pagination";
import { fetchTables } from "../../redux/slice/TableSlice";
import { selectCoffeeShopId } from "../../redux/slice/CoffeeShopSlice";

const OrderList = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const { currentUser } = useContext(AuthContext);
    const itemsPerPage = 5;

    const orders = useSelector((state) => state.orders.orders);
    const tables = useSelector((state) => state.tables.tables);
    const orderStatus = useSelector((state) => state.orders.status);
    const error = useSelector((state) => state.orders.error);
    const coffeeShopId = useSelector(selectCoffeeShopId);

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

    const filteredOrders =
        currentUser.data.userRole === 4
            ? orders.filter((order) => {
                  return order.coffeeShopId === coffeeShopId;
              })
            : orders;

    const currentOrders = filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
    );

    useEffect(() => {
        if (orderStatus === "idle") {
            dispatch(fetchOrders());
        }
        dispatch(fetchTables());

        socket.on("new_order", (notification) => {
            if (notification.type === "NEW_ORDER") {
                dispatch(orderReceived(notification.data));
            }
        });

        return () => {
            socket.off("new_order");
        };
    }, [orderStatus, dispatch]);

    const getTableName = (tableId) => {
        const table = tables.find((table) => table.id === tableId);
        return table ? table.tableName : "Unknown";
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getStatusStyles = (status) => {
        const styles = {
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "12px",
            textAlign: "center",
            mt: "13px",
            borderBottom: "2px solid",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        };
        switch (status) {
            case "Confirmed":
                styles.color = "green";
                styles.backgroundColor = "#d4edda";
                styles.borderColor = "#c3e6cb";
                break;
            case "Preparing":
                styles.color = "purple";
                styles.backgroundColor = "#e7e3e7";
                styles.borderColor = "#d6d6e0";
                break;
            case "Completed":
                styles.color = "red";
                styles.backgroundColor = "#f8d7da";
                styles.borderColor = "#f5c6cb";
                break;
            default:
                styles.color = "black";
                styles.backgroundColor = "transparent";
                styles.borderColor = "transparent";
                break;
        }
        return styles;
    };

    let content;

    if (orderStatus === "loading") {
        content = <LoadingContent />;
    } else if (orderStatus === "succeeded") {
        content = (
            <>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Table Name</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {getTableName(order.tableId)}
                                    </TableCell>
                                    <TableCell>${order.totalPrice}</TableCell>
                                    <TableCell
                                        sx={getStatusStyles(order.status)}
                                    >
                                        {order.status}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    totalItems={filteredOrders.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </>
        );
    } else if (orderStatus === "failed") {
        content = <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ m: "0 20px" }}>
                Order Overview
            </Typography>
            <Box id="notifications">{content}</Box>
        </Box>
    );
};

export default OrderList;
