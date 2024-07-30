// src/features/tables/tableSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const getTableById = createAsyncThunk(
    "tables/getTableById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/v1/tables/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchTables = createAsyncThunk(
    "tables/getList",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.get("/v1/auth/tables", {
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

export const createTable = createAsyncThunk(
    "tables/createTable",
    async (tableData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.post(
                "/v1/auth/tables",
                tableData,
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

export const updateTable = createAsyncThunk(
    "tables/updateTable",
    async (tableData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.put(
                `/v1/auth/tables/${tableData.id}`,
                {
                    tableName: tableData.tableName,
                    zone: tableData.zone,
                    tableCapacity: tableData.tableCapacity,
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

export const deleteTable = createAsyncThunk(
    "tables/deleteTable",
    async (tableId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axiosInstance.delete(
                `/v1/auth/tables/${tableId}`,
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

const tableSlice = createSlice({
    name: "tables",
    initialState: {
        tables: [],
        table: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTableById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTableById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.table = action.payload;
            })
            .addCase(getTableById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = action.payload;
            })
            .addCase(fetchTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTable.fulfilled, (state, action) => {
                state.loading = false;
                state.tables.push(action.payload);
            })
            .addCase(createTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTable.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tables.findIndex(
                    (table) => table.id === action.payload.id
                );
                if (index !== -1) {
                    state.tables[index] = action.payload;
                }
            })
            .addCase(updateTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTable.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = state.tables.filter(
                    (table) => table.id !== action.meta.arg
                );
            })
            .addCase(deleteTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete table";
            });
    },
});

export default tableSlice.reducer;
