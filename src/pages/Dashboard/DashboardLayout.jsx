import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const DashboardLayout = ({
    selectedItem,
    onItemClick,
    isSidebarOpen,
    toggleSidebar,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                color: "black",
            }}
        >
            <Sidebar
                selectedItem={selectedItem}
                onItemClick={onItemClick}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    transition: "margin-left 0.3s ease",
                    marginLeft: isSidebarOpen ? "260px" : "60px",
                    width: isSidebarOpen
                        ? `calc(95vw - 260px)`
                        : `calc(95vw - 60px)`,
                    overflow: "auto",
                    px: { xs: 2, sm: 3 },
                    pt: 4,
                    pb: 3,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
