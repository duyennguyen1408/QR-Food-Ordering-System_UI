import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const fetchCoffeeShopById = createAsyncThunk(
    "coffee-shops/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`v1/coffee-shops/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCoffeeShops = createAsyncThunk(
    "coffee-shops/fetchCoffeeShops",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.get("/v1/auth/coffee-shops", {
                headers: { access_token: token },
            });
            return response.data.rows;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createCoffeeShop = createAsyncThunk(
    "coffee-shops/createCoffeeShop",
    async (coffeeShopsData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.post(
                "/v1/auth/coffee-shops",
                coffeeShopsData,
                {
                    headers: { access_token: token },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to create coffee shop"
            );
        }
    }
);

export const updateCoffeeShop = createAsyncThunk(
    "coffee-shops/updateCoffeeShop",
    async (coffeeShopsData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.put(
                `/v1/auth/coffee-shops/${coffeeShopsData.id}`,
                coffeeShopsData,
                { headers: { access_token: token } }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to update coffee shop"
            );
        }
    }
);

export const deleteCoffeeShop = createAsyncThunk(
    "coffee-shops/deleteCoffeeShop",
    async (coffeeShopId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            await axiosInstance.delete(
                `/v1/auth/coffee-shops/${coffeeShopId}`,
                { headers: { access_token: token } }
            );
            return coffeeShopId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to delete coffee shop"
            );
        }
    }
);

const CoffeeShopSlice = createSlice({
    name: "coffeeShops",
    initialState: {
        coffeeShops: [],
        coffeeShopId: null,
        loading: false,
        error: null,
    },
    reducers: {
        setCoffeeShopId(state, action) {
            state.coffeeShopId = action.payload;
        },
        clearCoffeeShopId(state) {
            state.coffeeShopId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoffeeShops.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoffeeShops.fulfilled, (state, action) => {
                state.loading = false;
                state.coffeeShops = action.payload;
            })
            .addCase(fetchCoffeeShops.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCoffeeShopById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoffeeShopById.fulfilled, (state, action) => {
                state.loading = false;
                if (
                    !state.coffeeShops.find(
                        (shop) => shop.id === action.payload.id
                    )
                ) {
                    state.coffeeShops.push(action.payload);
                }
            })
            .addCase(fetchCoffeeShopById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCoffeeShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCoffeeShop.fulfilled, (state, action) => {
                state.loading = false;
                state.coffeeShops.push(action.payload);
            })
            .addCase(createCoffeeShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCoffeeShop.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCoffeeShop.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.coffeeShops.findIndex(
                    (coffeeShop) => coffeeShop.id === action.payload.id
                );
                if (index !== -1) {
                    state.coffeeShops[index] = action.payload;
                }
            })
            .addCase(updateCoffeeShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCoffeeShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCoffeeShop.fulfilled, (state, action) => {
                state.loading = false;
                state.coffeeShops = state.coffeeShops.filter(
                    (coffeeShop) => coffeeShop.id !== action.payload
                );
            })
            .addCase(deleteCoffeeShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete coffee shop";
            });
    },
});

export const { setCoffeeShopId, clearCoffeeShopId } = CoffeeShopSlice.actions;
export const selectCoffeeShopId = (state) => state.coffeeShops.coffeeShopId;
export default CoffeeShopSlice.reducer;
