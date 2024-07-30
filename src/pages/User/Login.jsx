import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slice/UserSlice";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "../User/Login.scss";
import ViewportWidthSetter from "../../components/layouts/ViewportWidthSetter/ViewportWidthSetter";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(AuthContext);
    const auth = useSelector((state) => state.users);
    const [onRequest, setOnRequest] = useState(false);
    const [loginProgress, setLoginProgress] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setOnRequest(true);
        setError(null);
        const formData = new FormData(event.target);
        const credentials = {
            username: formData.get("username"),
            password: formData.get("password"),
        };

        const interval = setInterval(() => {
            setLoginProgress((prev) => prev + 100 / 40);
        }, 50);

        try {
            const resultAction = await dispatch(login(credentials));
            if (login.fulfilled.match(resultAction)) {
                clearInterval(interval);
                setIsLoggedIn(true);
                const user = resultAction.payload;
                setCurrentUser(user);

                const userRole = user.data.userRole;
                if (userRole === 4 || userRole === 5) {
                    console.log("Navigating to /dashboard");
                    navigate("/dashboard");
                } else {
                    console.log("Navigating to /kitchen");
                    navigate("/kitchen");
                }
            } else {
                setError("Invalid username or password.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid username or password.");
        } finally {
            setOnRequest(false);
            clearInterval(interval);
        }
    };

    return (
        <>
            <ViewportWidthSetter />
            <div className="login-page">
                <div className="login-container">
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Login</h2>
                        <div className="input-field">
                            <input type="text" name="username" required />
                            <label>Enter your username</label>
                        </div>

                        <div className="input-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                            />
                            <label>Enter your password</label>
                        </div>
                        <div className="login-options">
                            <label className="show-password">
                                <input
                                    type="checkbox"
                                    name="show password"
                                    onChange={togglePasswordVisibility}
                                />
                                Show Password
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={onRequest}
                        >
                            SIGN IN
                        </button>
                    </form>

                    {onRequest && (
                        <div className="loading-overlay">
                            <div
                                className="loading-circle"
                                style={{ "--progress": `${loginProgress}%` }}
                            ></div>
                        </div>
                    )}

                    {error && <div className="error-text">{error}</div>}

                    {auth.status === "loading" && (
                        <div className="loading-text">Logging in...</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Login;
