import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Grid,
    Container,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch } from "react-redux";
import { addToCart, updateQuantity } from "../../redux/slice/CartSlice";
import CartIcon from "../../components/Icon/CartIcon";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";
import Pagination from "../../components/layouts/Pagination/Pagination";

const DishList = ({ dishes, selectedCategories }) => {
    const dispatch = useDispatch();
    const [dishStates, setDishStates] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const dishesPerPage = 6;

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    const toggleCounterAndAddToCart = (dish) => {
        setDishStates((prevState) => ({
            ...prevState,
            [dish.id]: {
                ...prevState[dish.id],
                showCounter: !prevState[dish.id]?.showCounter,
                count: prevState[dish.id]?.count || 1,
            },
        }));

        const dishToAdd = { ...dish, quantity: 1, type: "dish" };
        dispatch(addToCart(dishToAdd));
    };

    const increment = (id) => {
        setDishStates((prevState) => {
            const newCount = (prevState[id]?.count || 0) + 1;
            dispatch(updateQuantity({ id, quantity: newCount }));
            return {
                ...prevState,
                [id]: {
                    ...prevState[id],
                    count: newCount,
                },
            };
        });
    };

    const decrement = (id) => {
        setDishStates((prevState) => {
            const currentCount = prevState[id]?.count || 0;
            const newCount = currentCount > 0 ? currentCount - 1 : 0;
            dispatch(updateQuantity({ id, quantity: newCount }));
            return {
                ...prevState,
                [id]: {
                    ...prevState[id],
                    count: newCount,
                    showCounter: newCount !== 0,
                },
            };
        });
    };

    const filteredDishes = selectedCategories.length
        ? dishes.filter((dish) => selectedCategories.includes(dish.categoryId))
        : dishes;

    const indexOfLastDish = currentPage * dishesPerPage;
    const indexOfFirstDish = indexOfLastDish - dishesPerPage;
    const currentDishes = filteredDishes.slice(
        indexOfFirstDish,
        indexOfLastDish
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Container sx={{ p: "30px 25px" }}>
            <Typography
                variant="h2"
                gutterBottom
                sx={{
                    fontSize: "22px",
                    color: "#000000",
                    fontWeight: 600,
                    borderBottom: "2px solid rgba(6, 36, 97, 0.1019607843)",
                    paddingBottom: "25px",
                    marginBottom: "30px",
                    fontFamily: "Roboto",
                }}
            >
                Drinks and Desserts
            </Typography>

            {isLoading ? (
                <LoadingContent />
            ) : (
                <Grid container spacing={3}>
                    {currentDishes.map((dish) => (
                        <Grid item key={dish.id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    borderRadius: 2,
                                    bgcolor: "background.paper",
                                    boxShadow: 5,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: "auto",
                                        margin: "0 auto",
                                        objectFit: "cover",
                                    }}
                                    image={dish.itemImageUrl}
                                    alt={dish.dishTitle}
                                />
                                <CardContent
                                    sx={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {dish.dishTitle}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            flex: 1,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {dish.dishDesc}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mt: 2,
                                        }}
                                    >
                                        <Typography variant="h6">
                                            Price:
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "red",
                                                fontWeight: 700,
                                            }}
                                        >
                                            ${dish.dishPrice}
                                        </Typography>
                                    </Box>

                                    {!dishStates[dish.id]?.showCounter ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            data-testid={`add-to-cart-${dish.id}`}
                                            onClick={() =>
                                                toggleCounterAndAddToCart(dish)
                                            }
                                            sx={{
                                                width: "100%",
                                                mt: 2,
                                                fontWeight: 700,
                                                backgroundColor: "#32161a",
                                                "&:hover": {
                                                    backgroundColor: "black",
                                                    color: "white",
                                                },
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mt: { xs: 2, md: 3.5 },
                                            }}
                                        >
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#32161a",
                                                    color: "white",
                                                    border: "none",
                                                    width: "24px",
                                                    height: "24px",
                                                }}
                                                onClick={() =>
                                                    decrement(dish.id)
                                                }
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography
                                                variant="body2"
                                                sx={{ mx: 2 }}
                                            >
                                                {dishStates[dish.id]?.count ||
                                                    0}
                                            </Typography>
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#32161a",
                                                    color: "white",
                                                    border: "none",
                                                    width: "24px",
                                                    height: "24px",
                                                }}
                                                onClick={() =>
                                                    increment(dish.id)
                                                }
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Pagination
                totalItems={filteredDishes.length}
                itemsPerPage={dishesPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

            <CartIcon sx={{ mt: 3 }} />
        </Container>
    );
};

export default DishList;
