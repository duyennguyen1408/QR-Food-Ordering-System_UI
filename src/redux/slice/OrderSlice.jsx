import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.get("/v1/auth/orders", {
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

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({ tableId, totalPrice }, { rejectWithValue }) => {
        try {
            const orderData = {
                tableId,
                totalPrice,
            };

            const response = await axiosInstance.post("/v1/orders", orderData);
            return response.data.data; // Return the created order data
        } catch (error) {
            throw error; // Rethrow the error for component handling
        }
    }
);

export const deleteOrder = createAsyncThunk(
    "orders/deleteOrder",
    async (orderId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axiosInstance.delete(
                `/v1/auth/orders/${orderId}`,
                {
                    headers: {
                        access_token: token,
                    },
                }
            );
            return response.data;
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

export const updateOrderStatus = createAsyncThunk(
    "orders/updateOrderStatus",
    async ({ orderId, status }, { getState, rejectWithValue }) => {
        const token = getState().auth.token;

        try {
            const response = await axiosInstance.put(
                `/v1/auth/orders/${orderId}`,
                { status },
                {
                    headers: {
                        access_token: token,
                    },
                }
            );
            return response.data.data; // Dispatched data to the reducer
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data); // Return specific error details
            } else if (error.request) {
                return rejectWithValue("No response received");
            } else {
                return rejectWithValue("Error setting up request");
            }
        }
    }
);

const aggregateOrdersByDay = (orders) => {
    const dailyOrders = {};
    orders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        const day = `${orderDate.getDate()}/${
            orderDate.getMonth() + 1
        }/${orderDate.getFullYear()}`;
        if (!dailyOrders[day]) {
            dailyOrders[day] = 0;
        }
        dailyOrders[day]++;
    });
    return dailyOrders;
};

const aggregateTotalPriceByDay = (orders) => {
    const dailyTotalPrice = {};
    orders.forEach((order) => {
        const orderDate = new Date(order.orderDate).toISOString().split("T")[0];
        if (!dailyTotalPrice[orderDate]) {
            dailyTotalPrice[orderDate] = 0;
        }
        dailyTotalPrice[orderDate] += parseFloat(order.totalPrice);
    });
    return dailyTotalPrice;
};

const OrderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        orderId: null,
        status: "idle",
        error: null,
        dailyOrders: {},
        dailyTotalPrice: {},
    },
    reducers: {
        setOrderId: (state, action) => {
            state.orderId = action.payload;
        },
        resetOrder: (state) => {
            state.orderId = null;
        },
        orderReceived: (state, action) => {
            state.orders.push(action.payload);
        },
        orderStatusUpdated: (state, action) => {
            const { orderId, status } = action.payload;
            const existingOrder = state.orders.find(
                (order) => order.id === orderId
            );
            if (existingOrder) {
                existingOrder.status = status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.orders = action.payload;
                state.dailyOrders = aggregateOrdersByDay(action.payload);
                state.dailyTotalPrice = aggregateTotalPriceByDay(
                    action.payload
                );
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
                state.orderId = action.payload.id;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                const index = state.orders.findIndex(
                    (order) => order.id === action.payload.id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                window.location.reload();
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(
                    (order) => order.id !== action.meta.arg
                );
                window.location.reload();
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete order";
            });
    },
});

export const { orderReceived, orderStatusUpdated } = OrderSlice.actions;

export default OrderSlice.reducer;
