import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableById } from "../../redux/slice/TableSlice";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from "../../components/layouts/Loading/LoadingPage";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";
import ViewportWidthSetter from "../../components/layouts/ViewportWidthSetter/ViewportWidthSetter";

const TableDetail = () => {
    const { tableId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const table = useSelector((state) => state.tables.table);
    const loading = useSelector((state) => state.tables.loading);
    const error = useSelector((state) => state.tables.error);

    useEffect(() => {
        if (tableId) {
            dispatch(getTableById(tableId));
        }
    }, [dispatch, tableId]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <LoadingPage />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    if (!table) {
        return (
            <Container>
                <Typography>No table data available.</Typography>
            </Container>
        );
    }

    const menuPageUrl = `/coffee-shops/${encodeURIComponent(
        table.coffeeShopId
    )}/tables/${encodeURIComponent(tableId)}?table-name=${encodeURIComponent(
        table.tableName
    )}&zone=${encodeURIComponent(table.zone)}&capacity=${encodeURIComponent(
        table.tableCapacity
    )}`;

    const handleQRCodeClick = () => {
        console.log("Navigating to menuPageUrl:", menuPageUrl);
        navigate(menuPageUrl);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ minWidth: "calc(var(--vw, 1vw) * 100)" }}
        >
            <ViewportWidthSetter />
            <Container maxWidth="sm">
                {table.qrCode && (
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h6" gutterBottom>
                                Scan and Order:
                            </Typography>
                            <Typography variant="h4" color="green" gutterBottom>
                                OUR MENU
                            </Typography>
                            <CardMedia
                                component="img"
                                image={`data:image/png;base64,${table.qrCode}`}
                                onClick={handleQRCodeClick}
                                alt="QR Code"
                                style={{
                                    cursor: "pointer",
                                    width: 200,
                                    height: 200,
                                    margin: "0 auto",
                                }}
                            />
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default TableDetail;
