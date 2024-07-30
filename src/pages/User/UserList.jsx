import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUsers,
    updateUser,
    deleteUser,
} from "../../redux/slice/UserSlice";
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
import EditUser from "./EditUser";

const roleLabels = {
    1: "Waiter",
    2: "Barista",
    3: "Baker",
    4: "Manager",
    5: "Admin",
};

const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading, error } = useSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editUserData, setEditUserData] = useState({
        username: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        userRole: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePopoverOpen = (event, userId) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserId(userId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl) && selectedUserId !== null;
    const currentUser = users.find((user) => user.id === selectedUserId);

    useEffect(() => {
        if (currentUser) {
            setEditUserData({
                username: currentUser.username,
                password: currentUser.password,
                fullName: currentUser.fullName,
                phoneNumber: currentUser.phoneNumber,
                userRole: currentUser.userRole,
            });
        }
    }, [currentUser]);

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
        if (!currentUser) return;

        setIsEditing(true);
        handlePopoverClose();
    };

    const handleEditSave = async () => {
        try {
            const updatedUser = {
                id: selectedUserId,
                username: editUserData.username,
                password: editUserData.password,
                fullName: editUserData.fullName,
                phoneNumber: editUserData.phoneNumber,
                userRole: editUserData.userRole,
            };

            await dispatch(updateUser(updatedUser));

            setIsEditing(false);
            dispatch(fetchUsers());
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result;
            setEditUserData((prevState) => ({
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
        setEditUserData((prevState) => ({
            ...prevState,
            comboImageUrl: "",
        }));
        setSelectedImage(null);
    };

    const handleDelete = async (userId) => {
        try {
            await dispatch(deleteUser(userId));
            dispatch(fetchUsers());
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleAddUser = () => {
        navigate("/dashboard/add-user");
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
                Employee Overview
            </Typography>
            {isEditing ? (
                <EditUser
                    editUserData={editUserData}
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
                            onClick={handleAddUser}
                        >
                            <AddIcon sx={{ mr: 0.3, mb: 0.22 }} />
                            Add User
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
                                            Full Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            Phone Number
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle1">
                                            User Role
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
                                {currentItems.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {user.fullName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {user.phoneNumber}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {roleLabels[user.userRole]}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.userRole !== 5 && (
                                                <IconButton
                                                    aria-label="more options"
                                                    size="small"
                                                    onClick={(event) =>
                                                        handlePopoverOpen(
                                                            event,
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            )}
                                            <ItemPopover
                                                isOpen={isOpen}
                                                anchorEl={anchorEl}
                                                onClose={handlePopoverClose}
                                                onEditClick={handleEditClick}
                                                onDeleteClick={handleDelete}
                                                currentItem={currentUser}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Box>
    );
};

export default UserList;
