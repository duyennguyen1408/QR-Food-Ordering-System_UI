import React, { useState } from "react";
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Collapse,
    Box,
    Divider,
} from "@mui/material";

const CustomizedRadios = ({ value, onChange }) => {
    const [showBankTransferInfo, setShowBankTransferInfo] = useState(false);

    const handlePaymentMethodChange = (event) => {
        onChange(event);
        setShowBankTransferInfo(event.target.value === "bankTransfer");
    };

    return (
        <FormControl sx={{ display: "flex" }}>
            <FormLabel id="paymentMethodLabel">Payment Method</FormLabel>
            <RadioGroup
                aria-labelledby="paymentMethodLabel"
                name="paymentMethod"
                value={value}
                onChange={handlePaymentMethodChange}
                row
            >
                <FormControlLabel
                    value="OTC"
                    control={
                        <Radio
                            sx={{
                                "& .MuiSvgIcon-root:not(.MuiSvgIcon-root ~ .MuiSvgIcon-root)":
                                    {
                                        color: "#666666",
                                    },
                                "&, &.Mui-checked": {
                                    color: "blue",
                                },
                            }}
                        />
                    }
                    label="Over the counter (OTC) payment"
                />
                <FormControlLabel
                    value="bankTransfer"
                    control={
                        <Radio
                            sx={{
                                "& .MuiSvgIcon-root:not(.MuiSvgIcon-root ~ .MuiSvgIcon-root)":
                                    {
                                        color: "#666666",
                                    },
                                "&, &.Mui-checked": {
                                    color: "blue",
                                },
                            }}
                        />
                    }
                    label="Bank transfer"
                />
            </RadioGroup>
            <Collapse in={showBankTransferInfo}>
                <Box
                    style={{
                        textAlign: "center",
                        padding: "16px",
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Bank Transfer Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Account Number:</strong> 0929002667
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Account Holder:</strong> NGUYEN QUYNH DUYEN
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Receiving Bank:</strong> MB BANK
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Transfer Content Format:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        [Order ID] - [Customer's Name]
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Example: 888333 - NGUYEN VAN A
                    </Typography>

                    <Typography variant="body2">
                        Please ensure to verify the payment details with our
                        staff at the payment counter after successful transfer.
                    </Typography>
                </Box>
            </Collapse>
        </FormControl>
    );
};

export default CustomizedRadios;
