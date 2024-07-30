import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const fetchDishes = createAsyncThunk("dishes/fetch", async () => {
    const response = await axiosInstance.get("/v1/dishes");
    return response.data.rows; // Ensure this returns an array
});

export const fetchDishById = createAsyncThunk(
    "dishes/fetchById",
    async (id) => {
        try {
            const response = await axiosInstance.get(`v1/dishes/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
);

export const createDish = createAsyncThunk(
    "dishes/createDish",
    async (dishData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.post(
                "/v1/auth/dishes",
                dishData,
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

export const updateDish = createAsyncThunk(
    "dishes/updateDish",
    async (dishData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.put(
                `/v1/auth/dishes/${dishData.id}`,
                {
                    dishTitle: dishData.dishTitle,
                    dishDesc: dishData.dishDesc,
                    dishPrice: dishData.dishPrice,
                    itemImageUrl: dishData.itemImageUrl,
                },
                {
                    headers: {
                        access_token: token,
                    },
                }
            );
            return response.data.data;
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

export const deleteDish = createAsyncThunk(
    "dishes/deleteDish",
    async (dishId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axiosInstance.delete(
                `/v1/auth/dishes/${dishId}`,
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

const dishSlice = createSlice({
    name: "dishes",
    initialState: {
        dishes: [],
        dish: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDishes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDishes.fulfilled, (state, action) => {
                state.dishes = Array.isArray(action.payload)
                    ? action.payload
                    : [];
                state.loading = false;
            })
            .addCase(fetchDishes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchDishById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDishById.fulfilled, (state, action) => {
                state.loading = false;
                state.dishes.push(action.payload);
            })
            .addCase(fetchDishById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch dish by id.";
            })
            .addCase(createDish.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDish.fulfilled, (state, action) => {
                state.loading = false;
                state.dishes.push(action.payload);
            })
            .addCase(createDish.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateDish.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDish.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.dishes.findIndex(
                    (dish) => dish.id === action.payload.id
                );
                if (index !== -1) {
                    state.dishes[index] = action.payload;
                }
            })
            .addCase(updateDish.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteDish.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDish.fulfilled, (state, action) => {
                state.loading = false;
                state.dishes = state.dishes.filter(
                    (dish) => dish.id !== action.meta.arg
                );
            })
            .addCase(deleteDish.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete dish";
            });
    },
});

export default dishSlice.reducer;
