import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../context/axiosConfig";

export const login = createAsyncThunk("auth/login", async (credentials) => {
    const response = await axiosInstance.post("/v1/login", credentials);
    return response.data;
});

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.get("/v1/auth/users", {
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

export const createUser = createAsyncThunk(
    "users/createUser",
    async (userData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.post(
                "/v1/auth/create",
                userData,
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

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (userData, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.put(
                `/v1/auth/users/${userData.id}`,
                {
                    username: userData.username,
                    password: userData.password,
                    fullName: userData.fullName,
                    phoneNumber: userData.phoneNumber,
                    userRole: userData.userRole,
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

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (userId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await axiosInstance.delete(
                `/v1/auth/users/${userId}`,
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

const UserSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        user: null,
        loading: false,
        error: null,
        status: "idle",
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users.push(action.payload); // Add the new user to the state
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const index = state.users.findIndex(
                    (user) => user.id === action.payload.id
                );
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users = state.users.filter(
                    (user) => user.id !== action.meta.arg
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete user";
            })
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export const { logout } = UserSlice.actions;
export const { setCurrentUser } = UserSlice.actions;

export default UserSlice.reducer;
