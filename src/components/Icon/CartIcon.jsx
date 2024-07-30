import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Fab, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate, useParams } from "react-router-dom";
import { getTableById } from "../../redux/slice/TableSlice";
import { fetchCoffeeShopById } from "../../redux/slice/CoffeeShopSlice";

const CartIcon = () => {
    const { tableId } = useParams();
    const { coffeeShopId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const table = useSelector((state) => state.tables.table);
    const { coffeeShops } = useSelector((state) => state.coffeeShops);
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        if (tableId) {
            dispatch(getTableById(tableId));
        }
    }, [dispatch, tableId]);

    useEffect(() => {
        if (coffeeShopId) {
            dispatch(fetchCoffeeShopById(coffeeShopId));
        }
    }, [dispatch, coffeeShopId]);

    const handleClick = () => {
        navigate(`/coffee-shops/${coffeeShopId}/tables/${tableId}/cart`);
    };

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    if (totalItems === 0) {
        return null;
    }

    return (
        <Fab
            onClick={handleClick}
            data-testid="cart-icon"
            sx={{
                position: "fixed",
                bottom: 50,
                right: 20,
                backgroundColor: "#ffffff",
            }}
        >
            <Badge
                badgeContent={totalItems}
                data-testid="cart-badge"
                sx={{
                    "& .MuiBadge-badge": {
                        color: "white",
                        backgroundColor: "red",
                        top: -10,
                        left: 8,
                    },
                }}
            >
                <ShoppingCartIcon />
            </Badge>
        </Fab>
    );
};

export default CartIcon;
