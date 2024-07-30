import React, { useContext, useState } from "react";
import {
    Navigate,
    useLocation,
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { AuthContext } from "./context/authContext";
import ScrollToTop from "./components/layouts/ScrollToTop/ScrollToTop";
import Navbar from "./components/layouts/Navbar/Navbar";
import Footer from "./components/layouts/Footer/Footer";
import Menu from "./components/layouts/Menu/Menu";

import Login from "./pages/User/Login";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import DishTable from "./components/Tables/DishTable";
import AddDish from "./pages/Dish/AddDish";
import TableList from "./pages/Table/TableList";
import TableDetail from "./pages/Table/TableDetail";
import AddTable from "./pages/Table/AddTable";
import CategoryTable from "./components/Tables/CategoryTable";
import AddCategory from "./pages/Category/AddCategory";
import ComboTable from "./components/Tables/ComboTable";
import AddCombo from "./pages/Combo/AddCombo";
import ComboForm from "./components/Form/ComboForm";
import OrderList from "./pages/Order/OrderList";
import EditOrder from "./pages/Order/EditOrder";
import UserList from "./pages/User/UserList";
import AddUser from "./pages/User/AddUser";
import CoffeeShopList from "./pages/CoffeeShop/CoffeeShopList";
import AddCoffeeShop from "./pages/CoffeeShop/AddCoffeeShop";
import Kitchen from "./pages/Kitchen/Kitchen";
import Cart from "./pages/Cart/Cart";
import PaymentSuccess from "./components/layouts/PaymentSuccess/PaymentSuccess";

export function App() {
    const [selectedItem, setSelectedItem] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleItemClick = (itemId) => {
        setSelectedItem(itemId);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const ProtectedRoute = ({ children, allowedRoles }) => {
        const { currentUser } = useContext(AuthContext);
        const location = useLocation();
        const userRole = currentUser ? currentUser.data.userRole : null;

        console.log("Current user:", currentUser);
        console.log("Current user role:", userRole);
        console.log("Allowed roles:", allowedRoles);
        console.log("Current location:", location.pathname);

        if (!currentUser) {
            console.log("User not logged in, redirecting to /login");
            return <Navigate to="/login" state={{ from: location }} />;
        }

        if (!allowedRoles.includes(userRole)) {
            console.log(
                `User with role ${userRole} is not authorized for this route, redirecting to /login`
            );
            return <Navigate to="/login" state={{ from: location }} />;
        }

        console.log(`User with role ${userRole} is authorized for this route`);
        return children;
    };

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Chef Route */}
                <Route
                    path="/kitchen"
                    element={
                        <ProtectedRoute allowedRoles={[1, 2, 3]}>
                            <Kitchen />
                        </ProtectedRoute>
                    }
                />

                {/* Dashboard Route for Admin and Manager */}
                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute allowedRoles={[4, 5]}>
                            <DashboardLayout
                                selectedItem={selectedItem}
                                onItemClick={handleItemClick}
                                isSidebarOpen={isSidebarOpen}
                                toggleSidebar={toggleSidebar}
                            />
                        </ProtectedRoute>
                    }
                >
                    <Route path="order-list" element={<OrderList />} />
                    <Route path="menu-list" element={<DishTable />} />
                    <Route path="add-dish" element={<AddDish />} />
                    <Route path="table-list" element={<TableList />} />
                    <Route path="add-table" element={<AddTable />} />
                    <Route path="category-table" element={<CategoryTable />} />
                    <Route path="add-category" element={<AddCategory />} />
                    <Route path="user-list" element={<UserList />} />
                    <Route path="add-user" element={<AddUser />} />
                    <Route
                        path="coffee-shop-list"
                        element={<CoffeeShopList />}
                    />
                    <Route path="add-coffee-shop" element={<AddCoffeeShop />} />
                    <Route path="combo-table" element={<ComboTable />} />
                    <Route path="add-combo" element={<ComboForm />} />
                    <Route path="*" element={<Dashboard />} />
                </Route>

                {/* Public Routes */}
                <Route
                    path="*"
                    element={
                        <>
                            <Routes>
                                <Route
                                    path="/coffee-shops/:coffeeShopId/tables/:tableId/cart"
                                    element={<Cart />}
                                />
                                <Route
                                    path="/tables/:tableId"
                                    element={<TableDetail />}
                                />
                                <Route
                                    path="/order-success"
                                    element={<PaymentSuccess />}
                                />
                                <Route
                                    path="/coffee-shops/:coffeeShopId/tables/:tableId"
                                    element={<Menu />}
                                />
                            </Routes>
                        </>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
