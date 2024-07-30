import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const fetchOrderDetails = createAsyncThunk(
    "orderDetails/fetchOrderDetails",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.get("/v1/auth/order-details", {
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

export const createOrderDetail = createAsyncThunk(
    "orderDetails/createOrderDetail",
    async (orderData) => {
        const response = await axiosInstance.post(
            "/v1/order-details",
            orderData
        );
        return response.data;
    }
);

export const updateOrderDetailStatus = createAsyncThunk(
    "orderDetails/updateOrderDetailStatus",
    async ({ orderDetailId, status }, { getState, rejectWithValue }) => {
        const token = getState().auth.token;

        try {
            const response = await axiosInstance.put(
                `/v1/auth/order-details/${orderDetailId}`,
                { status },
                {
                    headers: {
                        access_token: token,
                    },
                }
            );
            return { orderDetailId, status: response.data.status };
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                return rejectWithValue("No response received");
            } else {
                return rejectWithValue("Error setting up request");
            }
        }
    }
);

const OrderDetailSlice = createSlice({
    name: "orderDetails",
    initialState: {
        orderDetails: [],
        status: "idle",
        error: null,
    },
    reducers: {
        orderDetailReceived: (state, action) => {
            state.orderDetails.push(action.payload);
        },
        orderDetailStatusUpdated: (state, action) => {
            const { orderDetailId, status } = action.payload;
            const orderDetailToUpdate = state.orderDetails.find(
                (order) => order.id === orderDetailId
            );
            if (orderDetailToUpdate) {
                orderDetailToUpdate.status = status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderDetails.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createOrderDetail.fulfilled, (state, action) => {
                state.orderDetails.push(action.payload);
            })
            .addCase(updateOrderDetailStatus.fulfilled, (state, action) => {
                const { orderDetailId, status } = action.payload;
                const orderDetailToUpdate = state.orderDetails.find(
                    (order) => order.id === orderDetailId
                );
                if (orderDetailToUpdate) {
                    orderDetailToUpdate.status = status;
                }
            });
    },
});

export const { orderDetailReceived, orderDetailStatusUpdated } =
    OrderDetailSlice.actions;

export default OrderDetailSlice.reducer;
