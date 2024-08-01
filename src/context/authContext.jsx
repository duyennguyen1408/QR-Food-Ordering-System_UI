import { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/slice/AuthSlice";
import { axiosInstance } from "./axiosConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(sessionStorage.getItem("user")) || null
    );
    const dispatch = useDispatch();

    const login = async (inputs) => {
        try {
            const res = await axiosInstance.post("/v1/login", inputs);
            setCurrentUser(res.data);
            dispatch(setToken(res.data.token));
            sessionStorage.setItem("user", JSON.stringify(res.data));
            return res;
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    };

    const register = async (inputs) => {
        try {
            const res = await axiosInstance.post("/v1/register", inputs);
            setCurrentUser(res.data);
            dispatch(setToken(res.data.token));
            sessionStorage.setItem("user", JSON.stringify(res.data));
            return res;
        } catch (err) {
            console.error("Register error:", err);
            throw err;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        dispatch(setToken(null));
        sessionStorage.removeItem("user");
    };

    useEffect(() => {
        sessionStorage.setItem("user", JSON.stringify(currentUser));
        if (currentUser) {
            dispatch(setToken(currentUser.data.token));
            console.log(currentUser.data.token);
        }
    }, [currentUser, dispatch]);

    return (
        <AuthContext.Provider
            value={{ currentUser, setCurrentUser, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
