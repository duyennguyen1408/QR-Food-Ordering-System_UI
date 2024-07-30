import { configureStore } from "@reduxjs/toolkit";
import CategorySlice from "./slice/CategorySlice";
import DishSlice from "./slice/DishSlice";
import CoffeeShopSlice from "./slice/CoffeeShopSlice";
import CustomerSlice from "./slice/CustomerSlice";
import TableSlice from "./slice/TableSlice";
import UserSlice from "./slice/UserSlice";
import OrderSlice from "./slice/OrderSlice";
import AuthSlice from "./slice/AuthSlice";
import CartSlice from "./slice/CartSlice";
import PaymentSlice from "./slice/PaymentSlice";
import OrderDetailSlice from "./slice/OrderDetailSlice";
import ComboSlice from "./slice/ComboSlice";
import ComboDetailSlice from "./slice/ComboDetailSlice";
export const store = configureStore({
    reducer: {
        categories: CategorySlice,
        dishes: DishSlice,
        coffeeShops: CoffeeShopSlice,
        customers: CustomerSlice,
        tables: TableSlice,
        orders: OrderSlice,
        orderDetails: OrderDetailSlice,
        combos: ComboSlice,
        comboDetails: ComboDetailSlice,
        cart: CartSlice,
        payments: PaymentSlice,
        users: UserSlice,
        auth: AuthSlice,
    },
});
