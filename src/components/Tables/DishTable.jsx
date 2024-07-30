import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchDishes,
    updateDish,
    deleteDish,
} from "../../redux/slice/DishSlice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
import LoadingContent from "../layouts/Loading/LoadingContent";
import Search from "../layouts/Search/Search";
import Pagination from "../layouts/Pagination/Pagination";
import ItemPopover from "../layouts/Popover/Popover";
import EditDish from "../../pages/Dish/EditDish";
const DishTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dishes, loading, error } = useSelector((state) => state.dishes);
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDishId, setSelectedDishId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editDishData, setEditDishData] = useState({
        categoryId: "",
        dishTitle: "",
        dishDesc: "",
        dishPrice: "",
        itemImageUrl: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        dispatch(fetchDishes());
    }, [dispatch]);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const filteredDishes = dishes.filter((dish) =>
        dish.dishTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDishes.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePopoverOpen = (event, dishId) => {
        setAnchorEl(event.currentTarget);
        setSelectedDishId(dishId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleAddDish = () => {
        navigate("/dashboard/add-dish");
    };

    const isOpen = Boolean(anchorEl) && selectedDishId !== null;
    const currentDish = dishes.find((dish) => dish.id === selectedDishId);

    useEffect(() => {
        if (currentDish) {
            setEditDishData({
                categoryId: currentDish.categoryId,
                dishTitle: currentDish.dishTitle,
                dishDesc: currentDish.dishDesc,
                dishPrice: currentDish.dishPrice,
                itemImageUrl: currentDish.itemImageUrl,
            });
        }
    }, [currentDish]);

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
        if (!currentDish) return;

        setIsEditing(true);
        handlePopoverClose();
    };

    const handleEditSave = async () => {
        try {
            const updatedDish = {
                id: selectedDishId,
                categoryId: editDishData.categoryId,
                dishTitle: editDishData.dishTitle,
                dishDesc: editDishData.dishDesc,
                dishPrice: editDishData.dishPrice,
                itemImageUrl: editDishData.itemImageUrl,
            };

            await dispatch(updateDish(updatedDish));

            setIsEditing(false);
            dispatch(fetchDishes());
        } catch (error) {
            console.error("Error updating dish:", error);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditDishData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result;
            setEditDishData((prevState) => ({
                ...prevState,
                itemImageUrl: imageUrl,
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        setSelectedImage(file);
    };

    const handleImageRemove = () => {
        setEditDishData((prevState) => ({
            ...prevState,
            itemImageUrl: "",
        }));
        setSelectedImage(null);
    };

    const handleDelete = async (dishId) => {
        try {
            await dispatch(deleteDish(dishId));
            dispatch(fetchDishes());
        } catch (error) {
            console.error("Error deleting dish:", error);
        }
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
                Menu Overview
            </Typography>
            {isEditing ? (
                <EditDish
                    editDishData={editDishData}
                    selectedImage={selectedImage}
                    onInputChange={handleInputChange}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
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
                            onClick={handleAddDish}
                        >
                            <AddIcon sx={{ mr: 0.3, mb: 0.22 }} />
                            Add Dish
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
                                            Image
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Dish Title
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Dish Description
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Dish Price
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
                                {currentItems.map((dish) => (
                                    <TableRow key={dish.id}>
                                        <TableCell align="center">
                                            <img
                                                src={dish.itemImageUrl}
                                                alt={dish.dishTitle}
                                                style={{
                                                    maxWidth: "100px",
                                                    maxHeight: "100px",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {dish.dishTitle}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {dish.dishDesc}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                ${dish.dishPrice}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                aria-label="more options"
                                                size="small"
                                                onClick={(event) =>
                                                    handlePopoverOpen(
                                                        event,
                                                        dish.id
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
                                                currentItem={currentDish}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        totalItems={filteredDishes.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Box>
    );
};

export default DishTable;
