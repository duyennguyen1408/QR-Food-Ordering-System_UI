import { render } from "preact";
import { App } from "./app.jsx";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./redux/store.jsx";
import { Provider } from "react-redux";
import { AuthContextProvider } from "./context/authContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </Provider>
    </React.StrictMode>
);
