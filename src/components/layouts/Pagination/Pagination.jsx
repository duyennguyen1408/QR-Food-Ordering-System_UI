import React from "react";
import { Box } from "@mui/material";
import { Pagination as MuiPagination } from "@mui/material";

const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}) => {
    const handlePageChange = (event, value) => {
        onPageChange(value);
    };

    return (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <MuiPagination
                count={Math.ceil(totalItems / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
            />
        </Box>
    );
};

export default Pagination;
