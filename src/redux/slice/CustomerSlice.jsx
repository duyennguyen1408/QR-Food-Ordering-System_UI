import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

const initialState = {
    customerId: null,
    fullName: "",
    phoneNumber: "",
    coffeeShopId: "",
    loading: false,
    error: null,
    customers: [],
};

export const fetchCustomers = createAsyncThunk(
    "customer/fetchCustomers",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.get("/v1/auth/customers", {
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

export const createCustomer = createAsyncThunk(
    "customer/createCustomer",
    async (customerData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/v1/customers",
                customerData
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCustomerById = createAsyncThunk(
    "customer/getCustomerById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/v1/customers/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomerId: (state, action) => {
            state.customerId = action.payload;
        },
        setFullName: (state, action) => {
            state.fullName = action.payload;
        },
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        },
        setCoffeeShopId: (state, action) => {
            state.coffeeShopId = action.payload;
        },
        resetForm: (state) => {
            state.fullName = "";
            state.phoneNumber = "";
            state.loading = false;
            state.error = null;
            state.customerId = null;
            state.coffeeShopId = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customerId = action.payload.id;
                state.coffeeShopId = action.payload.coffeeShopId;
                state.fullName = action.payload.fullName;
                state.phoneNumber = action.payload.phoneNumber;
                state.error = null;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCustomerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomerById.fulfilled, (state, action) => {
                state.loading = false;
                state.fullName = action.payload.fullName;
                state.phoneNumber = action.payload.phoneNumber;
                state.error = null;
            })
            .addCase(getCustomerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFullName,
    setPhoneNumber,
    resetForm,
    setCustomerId,
    setCoffeeShopId,
} = customerSlice.actions;

export default customerSlice.reducer;
