import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://qr-food-ordering-system-api.onrender.com",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["access_token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { axiosInstance };
