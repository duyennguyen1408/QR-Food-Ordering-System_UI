// src/redux/slice/PaymentSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

const initialState = {
    loading: false,
    error: null,
    payments: [],
};

export const fetchPayments = createAsyncThunk(
    "payments/fetchPayments",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        console.log("GET token:", token);
        try {
            const response = await axiosInstance.get("/v1/auth/payments", {
                headers: {
                    access_token: token,
                },
            });
            return response.data.rows;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createPayment = createAsyncThunk(
    "payments/createPayment",
    async ({ orderId, paymentDesc, paymentMethod }, { rejectWithValue }) => {
        try {
            const paymentData = {
                orderId,
                paymentDesc,
                paymentMethod,
                status: "success",
            };

            const response = await axiosInstance.post(
                "/v1/payments",
                paymentData
            );
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
);

const paymentSlice = createSlice({
    name: "payments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default paymentSlice.reducer;
