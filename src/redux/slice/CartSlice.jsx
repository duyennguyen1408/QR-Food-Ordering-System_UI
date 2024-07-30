import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, type, ...rest } = action.payload;
            const existingItemIndex = state.items.findIndex(
                (item) => item.id === id && item.type === type
            );

            if (existingItemIndex !== -1) {
                state.items[existingItemIndex].quantity +=
                    action.payload.quantity;
            } else {
                state.items.push({
                    id,
                    type,
                    ...rest,
                    quantity: action.payload.quantity,
                });
            }
            console.log("Items in cart after adding:", state.items);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.id === id);

            if (itemIndex !== -1) {
                state.items[itemIndex].quantity = quantity;
            }
            console.log("Items in cart after updating quantity:", state.items);
        },
        removeFromCart: (state, action) => {
            const { id } = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
            console.log("Items in cart after removing:", state.items);
        },
        clearCart: (state) => {
            state.items = [];
            console.log("Cart cleared. Items in cart:", state.items);
        },
    },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
