import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("accessToken") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("accessToken", action.payload);
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem("accessToken");
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
