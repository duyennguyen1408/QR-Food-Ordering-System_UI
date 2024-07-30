import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import {
    setFullName,
    setPhoneNumber,
    createCustomer,
    setCoffeeShopId,
} from "../../redux/slice/CustomerSlice";
import { useParams } from "react-router-dom";
import { getTableById } from "../../redux/slice/TableSlice";
import { fetchCoffeeShopById } from "../../redux/slice/CoffeeShopSlice";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
});

const CustomerForm = forwardRef((_, customerRef) => {
    const dispatch = useDispatch();
    const { id, coffeeShopId } = useParams();
    const storeCoffeeShopId = useSelector(
        (state) => state.customers.coffeeShopId
    );

    const initialValues = {
        fullName: "",
        phoneNumber: "",
        coffeeShopId: storeCoffeeShopId || "",
    };

    useEffect(() => {
        if (id) {
            dispatch(getTableById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (coffeeShopId) {
            dispatch(fetchCoffeeShopById(coffeeShopId));
            dispatch(setCoffeeShopId(coffeeShopId));
        }
    }, [dispatch, coffeeShopId]);

    const handleSubmit = async (values, { resetForm }) => {
        dispatch(setFullName(values.fullName));
        dispatch(setPhoneNumber(values.phoneNumber));

        const customerData = {
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            coffeeShopId: storeCoffeeShopId,
        };

        try {
            await dispatch(createCustomer(customerData)).unwrap();
            resetForm();
        } catch (error) {
            console.error("Failed to create customer", error);
        }
    };

    useImperativeHandle(customerRef, () => ({
        submitCustomerForm: () => {
            document.getElementById("customerFormSubmit").click();
        },
    }));

    return (
        <Box
            sx={{
                maxWidth: "100%",
                mt: 2,
                p: { md: "0 100px" },
            }}
        >
            <Box
                sx={{
                    color: "black",

                    textAlign: "center",
                    m: "10px 0",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Sign up for Special Offers!
                </Typography>
                <Typography
                    variant="body"
                    sx={{
                        color: "gray",
                    }}
                >
                    Sign up to get exclusive offers, coupons and limited-time
                    discounts through text messages.
                </Typography>
            </Box>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Box sx={{ width: "100%", mb: 2 }}>
                            <Field
                                as={TextField}
                                fullWidth
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                variant="outlined"
                                data-testid="full-name"
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
                                data-testid="phone-number"
                                error={
                                    touched.phoneNumber && !!errors.phoneNumber
                                }
                                helperText={
                                    touched.phoneNumber && errors.phoneNumber
                                }
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "gray",
                                mt: 1,
                            }}
                        >
                            <em>
                                This is optional. You can proceed to the next
                                step if you prefer.
                            </em>
                        </Typography>
                        <button
                            type="submit"
                            id="customerFormSubmit"
                            style={{ display: "none" }}
                            data-testid="customer-submit-button"
                        />
                        {isSubmitting ? (
                            <LoadingContent />
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <button
                                    type="submit"
                                    style={{ display: "none" }}
                                />
                            </Box>
                        )}
                        {/* Display error message if any */}
                        {errors && (
                            <Typography color="error" mt={2}>
                                {errors.message}
                            </Typography>
                        )}
                    </Form>
                )}
            </Formik>
        </Box>
    );
});

export default CustomerForm;
