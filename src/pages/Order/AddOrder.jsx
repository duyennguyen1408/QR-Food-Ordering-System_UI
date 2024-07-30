import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/slice/OrderSlice";
import { createOrderDetail } from "../../redux/slice/OrderDetailSlice";
import { getTableById } from "../../redux/slice/TableSlice";
import { useParams } from "react-router-dom";

const AddOrder = forwardRef(({ totalPrice }, ref) => {
    const dispatch = useDispatch();
    const { tableId } = useParams();
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        if (tableId) {
            dispatch(getTableById(tableId));
        }
    }, [dispatch, tableId]);

    const handleSubmit = async () => {
        try {
            const newOrder = await dispatch(
                createOrder({ tableId, totalPrice })
            );
            for (const item of cartItems) {
                const orderDetail = {
                    orderId: newOrder.payload.id,
                    quantity: item.quantity,
                    price: item.dishPrice || item.comboPrice,
                };

                if (item.type === "dish") {
                    orderDetail.dishId = item.id;
                } else if (item.type === "combo") {
                    orderDetail.comboId = item.id;
                }

                if (orderDetail.dishId || orderDetail.comboId) {
                    const newOrderDetail = await dispatch(
                        createOrderDetail(orderDetail)
                    ).unwrap();
                } else {
                    console.warn(
                        "Skipping item without dishId or comboId:",
                        item
                    );
                }
            }
        } catch (err) {
            console.error("Error creating order:", err);
        }
    };

    useImperativeHandle(ref, () => ({
        submitOrderForm: handleSubmit,
    }));

    return null;
});

export default AddOrder;
