import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const fetchComboDetails = createAsyncThunk(
    "comboDetails/fetch",
    async () => {
        const response = await axiosInstance.get("/v1/combo-details");
        return response.data.rows;
    }
);

export const fetchComboDetailById = createAsyncThunk(
    "comboDetails/fetchById",
    async (id) => {
        try {
            const response = await axiosInstance.get(`v1/combo-details/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
);

export const createComboDetail = createAsyncThunk(
    "comboDetails/createComboDetail",
    async ({ comboId, dishId, quantity }, { getState, rejectWithValue }) => {
        const token = getState().auth.token;

        try {
            const comboDetailData = {
                comboId,
                dishId,
                quantity,
            };

            const response = await axiosInstance.post(
                "/v1/auth/combo-details",
                comboDetailData,
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

export const deleteComboDetail = createAsyncThunk(
    "comboDetails/deleteComboDetail",
    async (comboDetailId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axiosInstance.delete(
                `/v1/auth/combo-details/${comboDetailId}`,
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

const ComboDetailSlice = createSlice({
    name: "comboDetails",
    initialState: {
        comboDetails: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComboDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComboDetails.fulfilled, (state, action) => {
                state.comboDetails = Array.isArray(action.payload)
                    ? action.payload
                    : [];
                state.loading = false;
            })
            .addCase(fetchComboDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createComboDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComboDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createComboDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchComboDetailById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComboDetailById.fulfilled, (state, action) => {
                state.loading = false;
                state.comboDetails = action.payload.data;
            })
            .addCase(fetchComboDetailById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
                    ? action.payload
                    : "Failed to fetch comboDetail detail.";
            })
            .addCase(deleteComboDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComboDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.comboDetails = state.comboDetails.filter(
                    (comboDetail) => comboDetail.id !== action.meta.arg
                );
            })
            .addCase(deleteComboDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete comboDetail";
            });
    },
});

export default ComboDetailSlice.reducer;
