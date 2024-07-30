import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import TableBarIcon from "@mui/icons-material/TableBar";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import StoreIcon from "@mui/icons-material/Store";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CommitSharpIcon from "@mui/icons-material/CommitSharp";
import { logout } from "../../redux/slice/UserSlice";

const drawerWidth = 260;
const collapsedDrawerWidth = 60;

const Sidebar = ({
    selectedItem,
    onItemClick,
    isSidebarOpen,
    toggleSidebar,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            id: "dashboard",
            hasSubmenu: false,
            path: "/dashboard",
        },
        {
            text: "Orders",
            icon: <ListAltIcon />,
            id: "orders",
            hasSubmenu: false,
            path: "/dashboard/order-list",
        },
        {
            text: "Coffee Shop",
            icon: <StoreIcon />,
            id: "coffee-shops",
            hasSubmenu: false,
            path: "/dashboard/coffee-shop-list",
        },
        {
            text: "Employees",
            icon: <PeopleIcon />,
            id: "employees",
            hasSubmenu: false,
            path: "/dashboard/user-list",
        },
        {
            text: "Menu",
            icon: <RestaurantMenuIcon />,
            id: "menu",
            hasSubmenu: true,
        },
        {
            text: "Tables",
            icon: <TableBarIcon />,
            id: "tables",
            hasSubmenu: false,
            path: "/dashboard/table-list",
        },
    ];

    const menuSubItems = [
        { text: "Menu List", id: "menuList", path: "/dashboard/menu-list" },
        {
            text: "Categories",
            id: "categories",
            path: "/dashboard/category-table",
        },
        { text: "Combos", id: "combos", path: "/dashboard/combo-table" },
    ];

    const getListItemStyle = (itemId) => {
        return selectedItem === itemId
            ? { color: "#1976d2", fontWeight: "bold" }
            : { color: "#333333" };
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleMenuClick = (itemId, path) => {
        if (itemId === "menu") {
            setIsMenuOpen(!isMenuOpen);
        } else {
            onItemClick(itemId);
            setIsMenuOpen(false);
            if (path) {
                navigate(path);
            }
        }
    };

    const renderArrowIcon = (isOpen) => {
        return isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />;
    };

    return (
        <Box
            sx={{
                width: isSidebarOpen ? drawerWidth : collapsedDrawerWidth,
                height: "100vh",
                backgroundColor: "#ffffff",
                borderRight: "1px solid #bdbdbd",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1000,
                color: "#172b4c",
                transition: "width 0.3s ease",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px",
                }}
            >
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        "&:focus": {
                            outline: "none !important",
                            boxShadow: "none !important",
                        },
                    }}
                    aria-label="menu"
                    disableFocusRipple
                >
                    <MenuIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <React.Fragment key={item.id}>
                        <ListItem
                            button
                            selected={selectedItem === item.id}
                            onClick={() => handleMenuClick(item.id, item.path)}
                        >
                            <ListItemIcon sx={getListItemStyle(item.id)}>
                                {item.icon}
                            </ListItemIcon>
                            {isSidebarOpen && (
                                <ListItemText
                                    primary={item.text}
                                    sx={getListItemStyle(item.id)}
                                />
                            )}
                            {item.hasSubmenu &&
                                renderArrowIcon(
                                    item.id === "menu" ? isMenuOpen : false
                                )}
                        </ListItem>
                        {item.id === "menu" && (
                            <Collapse
                                in={isMenuOpen}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {menuSubItems.map((subItem) => (
                                        <ListItem
                                            button
                                            key={subItem.id}
                                            sx={{ pl: 4 }}
                                            onClick={() =>
                                                handleMenuClick(
                                                    subItem.id,
                                                    subItem.path
                                                )
                                            }
                                        >
                                            <ListItemIcon>
                                                <CommitSharpIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={subItem.text}
                                                sx={getListItemStyle(
                                                    subItem.id
                                                )}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
            <Divider />
            <ListItem
                button
                onClick={handleLogout}
                sx={{ marginTop: "auto", marginBottom: "20px" }}
            >
                <ListItemIcon sx={{ color: "red" }}>
                    <ExitToAppIcon />
                </ListItemIcon>
                {isSidebarOpen && (
                    <ListItemText primary="Logout" sx={{ color: "red" }} />
                )}
            </ListItem>
        </Box>
    );
};

export default Sidebar;
