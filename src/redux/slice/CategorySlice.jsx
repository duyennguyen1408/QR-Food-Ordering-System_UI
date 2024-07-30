import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const fetchCategories = createAsyncThunk(
    "categories/fetch",
    async () => {
        const response = await axiosInstance.get("/v1/categories");
        return response.data.rows; // Ensure this returns an array
    }
);

export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (categoryData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.post(
                "/v1/auth/categories",
                categoryData,
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

export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async (categoryData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.put(
                `/v1/auth/categories/${categoryData.id}`,
                {
                    categoryName: categoryData.categoryName,
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

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (categoryId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axiosInstance.delete(
                `/v1/auth/categories/${categoryId}`,
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

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = Array.isArray(action.payload)
                    ? action.payload
                    : [];
                state.loading = false;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(
                    (category) => category.id === action.payload.id
                );
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(
                    (category) => category.id !== action.meta.arg
                );
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete category";
            });
    },
});

export default categorySlice.reducer;
