import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const fetchCombos = createAsyncThunk("combos/fetch", async () => {
    const response = await axiosInstance.get("/v1/combos");
    return response.data.rows;
});

export const fetchComboById = createAsyncThunk(
    "combos/fetchById",
    async (id) => {
        try {
            const response = await axiosInstance.get(`v1/combos/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
);

export const createCombo = createAsyncThunk(
    "combos/createCombo",
    async (comboData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.post(
                "/v1/auth/combos",
                comboData,
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

export const updateCombo = createAsyncThunk(
    "combos/updateCombo",
    async (comboData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.put(
                `/v1/auth/combos/${comboData.id}`,
                {
                    comboName: comboData.comboName,
                    comboDesc: comboData.comboDesc,
                    comboPrice: comboData.comboPrice,
                    comboImageUrl: comboData.comboImageUrl,
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

export const deleteCombo = createAsyncThunk(
    "combos/deleteCombo",
    async (comboId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axiosInstance.delete(
                `/v1/auth/combos/${comboId}`,
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

const ComboSlice = createSlice({
    name: "combos",
    initialState: {
        combos: [],
        combo: null,
        comboId: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCombos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCombos.fulfilled, (state, action) => {
                state.combos = Array.isArray(action.payload)
                    ? action.payload
                    : [];
                state.loading = false;
            })
            .addCase(fetchCombos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchComboById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComboById.fulfilled, (state, action) => {
                state.loading = false;
                state.combos.push(action.payload);
            })
            .addCase(fetchComboById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
                    ? action.payload
                    : "Failed to fetch combo by id.";
            })
            .addCase(createCombo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCombo.fulfilled, (state, action) => {
                state.loading = false;
                state.comboId = action.payload.id;
                state.combos.push(action.payload);
            })
            .addCase(createCombo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCombo.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCombo.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.combos.findIndex(
                    (combo) => combo.id === action.payload.id
                );
                if (index !== -1) {
                    state.combos[index] = action.payload;
                }
            })
            .addCase(updateCombo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCombo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCombo.fulfilled, (state, action) => {
                state.loading = false;
                state.combos = state.combos.filter(
                    (combo) => combo.id !== action.meta.arg
                );
            })
            .addCase(deleteCombo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete combo";
            });
    },
});

export default ComboSlice.reducer;
