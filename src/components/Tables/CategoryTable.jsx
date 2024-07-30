import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchCategories,
    updateCategory,
    deleteCategory,
} from "../../redux/slice/CategorySlice";
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
import EditCategory from "../../pages/Category/EditCategory";
import { fetchCoffeeShops } from "../../redux/slice/CoffeeShopSlice";
const CategoryTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, isLoading, error } = useSelector(
        (state) => state.categories
    );
    const { coffeeShops } = useSelector((state) => state.coffeeShops);
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editCategoryData, setEditCategoryData] = useState({
        coffeeShopId: "",
        categoryName: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCoffeeShops());
    }, [dispatch]);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const filteredCategories = categories.filter((category) =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePopoverOpen = (event, categoryId) => {
        setAnchorEl(event.currentTarget);
        setSelectedCategoryId(categoryId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleAddCategory = () => {
        navigate("/dashboard/add-category");
    };

    const isOpen = Boolean(anchorEl) && selectedCategoryId !== null;
    const currentCategory = categories.find(
        (category) => category.id === selectedCategoryId
    );

    useEffect(() => {
        if (currentCategory) {
            setEditCategoryData({
                coffeeShopId: currentCategory.coffeeShopId,
                categoryName: currentCategory.categoryName,
            });
        }
    }, [currentCategory]);

    if (isLoading) {
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
        if (!currentCategory) return;

        setIsEditing(true);
        handlePopoverClose();
    };

    const handleEditSave = async () => {
        try {
            const updatedCategory = {
                id: selectedCategoryId,
                coffeeShopId: editCategoryData.coffeeShopId,
                categoryName: editCategoryData.categoryName,
            };

            await dispatch(updateCategory(updatedCategory));

            setIsEditing(false);
            dispatch(fetchCategories());
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditCategoryData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result;
            setEditCategoryData((prevState) => ({
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
        setEditCategoryData((prevState) => ({
            ...prevState,
            itemImageUrl: "",
        }));
        setSelectedImage(null);
    };

    const handleDelete = async (categoryId) => {
        try {
            await dispatch(deleteCategory(categoryId));
            dispatch(fetchCategories());
        } catch (error) {
            console.error("Error deleting category:", error);
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
                Category Overview
            </Typography>
            {isEditing ? (
                <EditCategory
                    editCategoryData={editCategoryData}
                    onInputChange={handleInputChange}
                    onSave={handleEditSave}
                    onCancel={handleEditCancel}
                    coffeeShops={coffeeShops}
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
                            onClick={handleAddCategory}
                        >
                            <AddIcon sx={{ mr: 0.3, mb: 0.22 }} />
                            Add Category
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
                                            Category Name
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
                                {currentItems.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {category.categoryName}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton
                                                aria-label="more options"
                                                size="small"
                                                onClick={(event) =>
                                                    handlePopoverOpen(
                                                        event,
                                                        category.id
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
                                                currentItem={currentCategory}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        totalItems={filteredCategories.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Box>
    );
};

export default CategoryTable;
