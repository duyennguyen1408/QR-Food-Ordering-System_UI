import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCombos,
    updateCombo,
    deleteCombo,
} from "../../redux/slice/ComboSlice";
import {
    fetchComboDetails,
    deleteComboDetail,
} from "../../redux/slice/ComboDetailSlice";
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
import LoadingContent from "../layouts/Loading/LoadingContent";
import Search from "../layouts/Search/Search";
import ImageUpload from "../layouts/ImageUpload/ImageUpload";
import Pagination from "../layouts/Pagination/Pagination";
import ItemPopover from "../layouts/Popover/Popover";
import EditCombo from "../../pages/Combo/EditCombo";

const ComboTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { combos, loading, error } = useSelector((state) => state.combos);
    const { comboDetails } = useSelector((state) => state.comboDetails);
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedComboId, setSelectedComboId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editComboData, setEditComboData] = useState({
        comboName: "",
        comboDesc: "",
        comboPrice: "",
        comboImageUrl: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        dispatch(fetchCombos());
        dispatch(fetchComboDetails());
    }, [dispatch]);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const filteredCombos = combos.filter((combo) =>
        combo.comboName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCombos.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePopoverOpen = (event, comboId) => {
        setAnchorEl(event.currentTarget);
        setSelectedComboId(comboId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl) && selectedComboId !== null;
    const currentCombo = combos.find((combo) => combo.id === selectedComboId);

    useEffect(() => {
        if (currentCombo) {
            setEditComboData({
                comboName: currentCombo.comboName,
                comboDesc: currentCombo.comboDesc,
                comboPrice: currentCombo.comboPrice,
                comboImageUrl: currentCombo.comboImageUrl,
            });
        }
    }, [currentCombo]);

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
        if (!currentCombo) return;

        setIsEditing(true);
        handlePopoverClose();
    };

    const handleEditSave = async () => {
        try {
            const updatedCombo = {
                id: selectedComboId,
                comboName: editComboData.comboName,
                comboDesc: editComboData.comboDesc,
                comboPrice: editComboData.comboPrice,
                comboImageUrl: editComboData.comboImageUrl,
            };

            await dispatch(updateCombo(updatedCombo));

            setIsEditing(false);
            dispatch(fetchCombos());
        } catch (error) {
            console.error("Error updating combo:", error);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditComboData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result;
            setEditComboData((prevState) => ({
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
        setEditComboData((prevState) => ({
            ...prevState,
            comboImageUrl: "",
        }));
        setSelectedImage(null);
    };

    const handleDelete = async (comboId) => {
        try {
            handlePopoverClose();

            const comboDetailsToDelete = comboDetails.filter(
                (comboDetail) => comboDetail.comboId === comboId
            );

            if (comboDetailsToDelete.length > 0) {
                const deleteDetailsPromises = comboDetailsToDelete.map(
                    (comboDetail) => dispatch(deleteComboDetail(comboDetail.id))
                );

                const results = await Promise.all(deleteDetailsPromises);

                results.forEach((result, index) => {
                    if (result.error) {
                        throw new Error(
                            `Failed to delete combo detail with ID: ${comboDetailsToDelete[index].id}`
                        );
                    }
                });
            }
            const comboDeleteResult = await dispatch(deleteCombo(comboId));
            if (comboDeleteResult.error) {
                throw new Error(`Failed to delete combo with ID: ${comboId}`);
            }
            await dispatch(fetchCombos());

            setSelectedComboId(null);
        } catch (error) {
            console.error("Error deleting combo:", error.message);
        }
    };

    const handleAddCombo = () => {
        navigate("/dashboard/add-combo");
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
                Combo Overview
            </Typography>
            {isEditing ? (
                <EditCombo
                    editComboData={editComboData}
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
                            onClick={handleAddCombo}
                        >
                            <AddIcon sx={{ mr: 0.3, mb: 0.22 }} />
                            Add Combo
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
                                            Combo Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Combo Description
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Combo Price
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
                                {currentItems.map((combo) => (
                                    <TableRow key={combo.id}>
                                        <TableCell align="center">
                                            <img
                                                src={combo.comboImageUrl}
                                                alt={combo.comboName}
                                                style={{
                                                    maxWidth: "100px",
                                                    maxHeight: "100px",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {combo.comboName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {combo.comboDesc}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                ${combo.comboPrice}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                aria-label="more options"
                                                size="small"
                                                onClick={(event) =>
                                                    handlePopoverOpen(
                                                        event,
                                                        combo.id
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
                                                    handleDelete(
                                                        selectedComboId
                                                    )
                                                }
                                                currentItem={currentCombo}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        totalItems={filteredCombos.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Box>
    );
};

export default ComboTable;
