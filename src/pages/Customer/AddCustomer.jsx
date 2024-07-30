import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFullName, setPhoneNumber } from "../../redux/slice/CustomerSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
});

const CustomerForm = () => {
    const dispatch = useDispatch();
    const { fullName, phoneNumber } = useSelector((state) => state.customers);

    const initialValues = {
        fullName: fullName || "",
        phoneNumber: phoneNumber || "",
    };

    const handleSubmit = (values) => {
        dispatch(setFullName(values.fullName));
        dispatch(setPhoneNumber(values.phoneNumber));
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mt: 2,
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
            >
                Enter your personal details
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched }) => (
                    <Form>
                        <Box sx={{ width: "100%", mb: 2 }}>
                            <Field
                                as={TextField}
                                fullWidth
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                variant="outlined"
                                error={touched.fullName && !!errors.fullName}
                                helperText={touched.fullName && errors.fullName}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Field
                                as={TextField}
                                fullWidth
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Phone Number"
                                variant="outlined"
                                error={
                                    touched.phoneNumber && !!errors.phoneNumber
                                }
                                helperText={
                                    touched.phoneNumber && errors.phoneNumber
                                }
                            />
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default CustomerForm;
