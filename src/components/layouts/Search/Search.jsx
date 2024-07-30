import React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Search = ({ searchTerm, onSearchChange }) => {
    const handleInputChange = (event) => {
        onSearchChange(event.target.value);
    };

    return (
        <TextField
            size="small"
            variant="outlined"
            margin="normal"
            label="Search"
            value={searchTerm}
            onChange={handleInputChange}
            InputProps={{
                endAdornment: (
                    <IconButton size="small">
                        <SearchOutlinedIcon />
                    </IconButton>
                ),
            }}
        />
    );
};

export default Search;
