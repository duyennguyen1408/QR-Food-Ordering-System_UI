import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteOrder } from "../../redux/slice/OrderSlice";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

const DeleteOrder = ({ orderId, onClose }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(true);

    const handleDelete = () => {
        dispatch(deleteOrder(orderId));
        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Delete Order"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this order?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    sx={{
                        borderColor: "#7c4b52",
                        color: "#7c4b52",
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    sx={{ backgroundColor: "#7c4b52", color: "#fff" }}
                    autoFocus
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteOrder;
