// ItemPopover.js

import React from "react";
import { Popover, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemPopover = ({
    isOpen,
    anchorEl,
    onClose,
    onEditClick,
    onDeleteClick,
    currentItem,
}) => {
    return (
        <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            {currentItem && (
                <>
                    <MenuItem onClick={onEditClick}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Edit
                    </MenuItem>
                    <MenuItem
                        onClick={() => onDeleteClick(currentItem.id)}
                        style={{ color: "red" }}
                    >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                    </MenuItem>
                </>
            )}
        </Popover>
    );
};

export default ItemPopover;
