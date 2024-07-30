import React from "react";
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const EditTable = ({ editTableData, onInputChange, onSave, onCancel }) => {
    return (
        <Box>
            <TextField
                name="tableName"
                label="Table Name"
                value={editTableData.tableName}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="zone"
                label="Zone"
                value={editTableData.zone}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="tableCapacity"
                label="Table Capacity"
                value={editTableData.tableCapacity}
                onChange={onInputChange}
                fullWidth
                margin="normal"
            />
            <Box display="flex" justifyContent={"space-between"} mt={2}>
                <Button
                    variant="contained"
                    sx={{
                        marginRight: "14px",
                        borderRadius: "4px",
                        backgroundColor: "black",
                        fontWeight: "500",
                    }}
                    onClick={onSave}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
                        borderRadius: "4px",
                    }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default EditTable;
