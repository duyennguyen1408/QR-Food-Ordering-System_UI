import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchTables,
    updateTable,
    deleteTable,
} from "../../redux/slice/TableSlice";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useMediaQuery, useTheme } from "@mui/material";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";
import Search from "../../components/layouts/Search/Search";
import ImageUpload from "../../components/layouts/ImageUpload/ImageUpload";
import Pagination from "../../components/layouts/Pagination/Pagination";
import ItemPopover from "../../components/layouts/Popover/Popover";
import EditTable from "./EditTable";

const TableList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tables, loading, error } = useSelector((state) => state.tables);
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTableData, setEditTableData] = useState({
        tableName: "",
        zone: "",
        tableCapacity: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        dispatch(fetchTables());
    }, [dispatch]);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const filteredTables = tables.filter((table) =>
        table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTables.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePopoverOpen = (event, tableId) => {
        setAnchorEl(event.currentTarget);
        setSelectedTableId(tableId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl) && selectedTableId !== null;
    const currentTable = tables.find((table) => table.id === selectedTableId);

    useEffect(() => {
        if (currentTable) {
            setEditTableData({
                tableName: currentTable.tableName,
                zone: currentTable.zone,
                tableCapacity: currentTable.tableCapacity,
            });
        }
    }, [currentTable]);

    if (loading) {
        return (
            <div>
                <LoadingContent />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleEditClick = () => {
        if (!currentTable) return;

        setIsEditing(true);
        handlePopoverClose();
    };

    const handleEditSave = async () => {
        try {
            const updatedTable = {
                id: selectedTableId,
                tableName: editTableData.tableName,
                zone: editTableData.zone,
                tableCapacity: editTableData.tableCapacity,
            };

            await dispatch(updateTable(updatedTable));

            setIsEditing(false);
            dispatch(fetchTables());
        } catch (error) {
            console.error("Error updating table:", error);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditTableData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result;
            setEditTableData((prevState) => ({
                ...prevState,
                comboImageUrl: imageUrl,
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        setSelectedImage(file);
    };

    const handleImageRemove = () => {
        setEditTableData((prevState) => ({
            ...prevState,
            comboImageUrl: "",
        }));
        setSelectedImage(null);
    };

    const handleDelete = async (tableId) => {
        try {
            await dispatch(deleteTable(tableId));
            dispatch(fetchTables());
        } catch (error) {
            console.error("Error deleting table:", error);
        }
    };

    const handleAddTable = () => {
        navigate("/dashboard/add-table");
    };

    return (
        <Box
            mt={2}
            mx={isMobile ? 1 : isTablet ? 2 : 3}
            sx={{
                maxWidth: "100%",
            }}
        >
            <Typography variant="h4" sx={{ mb: 3 }}>
                Table Overview
            </Typography>
            {isEditing ? (
                <EditTable
                    editTableData={editTableData}
                    onInputChange={handleInputChange}
                    onSave={handleEditSave}
                    onCancel={handleEditCancel}
                />
            ) : (
                <>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                fontWeight: "700",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={handleAddTable}
                        >
                            <AddIcon sx={{ mr: 0.3, mb: 0.22 }} />
                            Add Table
                        </Button>
                        <Search
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                        />
                    </Box>
                    <TableContainer component={Paper} sx={{ width: "100%" }}>
                        <Table size="small" sx={{ width: "100%" }}>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        backgroundColor: "rgb(244, 246, 248)",
                                        color: "rgb(99, 115, 129)",
                                    }}
                                >
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Table Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Zone
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Table Capacity
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Actions
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((table) => (
                                    <TableRow key={table.id}>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {table.tableName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {table.zone}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {table.tableCapacity}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                aria-label="more options"
                                                size="small"
                                                onClick={(event) =>
                                                    handlePopoverOpen(
                                                        event,
                                                        table.id
                                                    )
                                                }
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <ItemPopover
                                                isOpen={isOpen}
                                                anchorEl={anchorEl}
                                                onClose={handlePopoverClose}
                                                onEditClick={handleEditClick}
                                                onDeleteClick={handleDelete}
                                                currentItem={currentTable}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        totalItems={filteredTables.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Box>
    );
};

export default TableList;
