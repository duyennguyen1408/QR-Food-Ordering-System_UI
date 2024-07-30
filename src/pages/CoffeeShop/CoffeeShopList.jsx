import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCoffeeShops,
    updateCoffeeShop,
    deleteCoffeeShop,
} from "../../redux/slice/CoffeeShopSlice";
import { fetchUsers } from "../../redux/slice/UserSlice";
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
import Pagination from "../../components/layouts/Pagination/Pagination";
import ItemPopover from "../../components/layouts/Popover/Popover";
import EditCoffeeShop from "./EditCoffeeShop";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const CoffeeShopList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { coffeeShops, loading, error } = useSelector(
        (state) => state.coffeeShops
    );
    const { users } = useSelector((state) => state.users);
    const [managerName, setManagerName] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCoffeeShopId, setSelectedCoffeeShopId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editCoffeeData, setEditCoffeeData] = useState({
        managerId: "",
        coffeeShopName: "",
        coffeeShopDesc: "",
    });
    useEffect(() => {
        const fetchAndMapUsers = async () => {
            const users = await dispatch(fetchUsers()).unwrap();
            const managerName = {};
            users.forEach((user) => {
                if (user.userRole === 4) {
                    managerName[user.id] = user.fullName;
                }
            });
            setManagerName(managerName);
        };
        fetchAndMapUsers();
    }, [dispatch]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchCoffeeShops());
        dispatch(fetchUsers());
    }, [dispatch]);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const filteredCoffeeShops = coffeeShops.filter((coffeeShop) =>
        coffeeShop.coffeeShopName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCoffeeShops.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePopoverOpen = (event, coffeeShopId) => {
        setAnchorEl(event.currentTarget);
        setSelectedCoffeeShopId(coffeeShopId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl) && selectedCoffeeShopId !== null;
    const currentCoffeeShop = coffeeShops.find(
        (coffeeShop) => coffeeShop.id === selectedCoffeeShopId
    );

    useEffect(() => {
        if (currentCoffeeShop) {
            setEditCoffeeData({
                managerId: currentCoffeeShop.managerId,
                coffeeShopName: currentCoffeeShop.coffeeShopName,
                coffeeShopDesc: currentCoffeeShop.coffeeShopDesc,
            });
        }
    }, [currentCoffeeShop]);

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
        if (!currentCoffeeShop) return;

        setIsEditing(true);
        handlePopoverClose();
    };

    const handleEditSave = async () => {
        try {
            const updatedCoffeeShop = {
                id: selectedCoffeeShopId,
                managerId: editCoffeeData.managerId,
                coffeeShopName: editCoffeeData.coffeeShopName,
                coffeeShopDesc: editCoffeeData.coffeeShopDesc,
            };

            await dispatch(updateCoffeeShop(updatedCoffeeShop));

            setIsEditing(false);
            dispatch(fetchCoffeeShops());
        } catch (error) {
            console.error("Error updating coffeeShop:", error);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditCoffeeData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDelete = async (coffeeShopId) => {
        try {
            await dispatch(deleteCoffeeShop(coffeeShopId));
            dispatch(fetchCoffeeShops());
        } catch (error) {
            console.error("Error deleting coffeeShop:", error);
        }
    };

    const handleAddTable = () => {
        navigate("/dashboard/add-coffee-shop");
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
                Coffee Shop Overview
            </Typography>
            {isEditing ? (
                <EditCoffeeShop
                    editCoffeeShopData={editCoffeeData}
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
                            Add Coffee Shop
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
                                            Manager
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Coffee Shop Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Coffee Shop Description
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
                                {currentItems.map((coffeeShop) => (
                                    <TableRow key={coffeeShop.id}>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {managerName[
                                                    coffeeShop.managerId
                                                ] || "N/A"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {coffeeShop.coffeeShopName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {coffeeShop.coffeeShopDesc}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton
                                                aria-label="more options"
                                                size="small"
                                                onClick={(event) =>
                                                    handlePopoverOpen(
                                                        event,
                                                        coffeeShop.id
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
                                                onDeleteClick={() =>
                                                    handleDelete(coffeeShop.id)
                                                }
                                                currentItem={currentCoffeeShop}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        totalItems={filteredCoffeeShops.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Box>
    );
};

export default CoffeeShopList;
