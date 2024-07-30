import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Dropdown = ({ anchorEl, open, onClose, items }) => {
    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            {items.map((item, index) => (
                <MenuItem key={index} onClick={() => onClose(item.value)}>
                    {item.label}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default Dropdown;
