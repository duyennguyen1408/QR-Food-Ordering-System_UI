import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CoffeeShopDetail from "../../../pages/CoffeeShop/CoffeeShopDetail";
import DishList from "../../../pages/Dish/DishList";
import CategoryList from "../../../pages/Category/CategoryList";
import ComboList from "../../../pages/Combo/ComboList";
import CustomerForm from "../../../pages/Customer/AddCustomer";
import { fetchCategories } from "../../../redux/slice/CategorySlice";
import { fetchDishes } from "../../../redux/slice/DishSlice";
import "../Menu/Menu.scss";
import Banner1 from "../../../assets/banner1.png";
import CartIcon from "../../Icon/CartIcon";
import { Grid } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
function Menu({ cartCount }) {
    const dispatch = useDispatch();
    const { coffeeShopId, tableId } = useParams();
    const { categories } = useSelector((state) => state.categories);
    const { dishes } = useSelector((state) => state.dishes);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchDishes());
    }, [dispatch]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevState) =>
            prevState.includes(categoryId)
                ? prevState.filter((id) => id !== categoryId)
                : [...prevState, categoryId]
        );
    };

    return (
        <div>
            <Navbar />
            <div className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h4>Welcome to Coffee Shop</h4>
                        <h1>The Great Coffee</h1>
                        <h1>For Some Joy!</h1>
                        <p className="hero-desc">
                            Sourced with meticulous care and crafted with
                            unwavering passion, we bring you exceptional coffee
                            that not only delights your senses but also nurtures
                            your well-being and respects our planet. Our
                            commitment to sustainability and quality ensures
                            that every cup you enjoy is a step towards a better
                            future for coffee farmers, the environment, and you.
                            Experience the rich, nuanced flavors of our coffee,
                            knowing that each sip supports ethical practices and
                            a greener world.
                        </p>
                    </div>
                    <div className="hero-thump">
                        <img src={Banner1} alt="Banner1 image" />
                    </div>
                </div>
            </div>
            <CoffeeShopDetail />
            <ComboList />
            <Grid
                container
                spacing={3}
                sx={{ p: { xs: "0 30px", md: "0 50px", xl: "0 120px" } }}
            >
                <Grid item xs={12} md={4}>
                    <CategoryList onCategoryChange={handleCategoryChange} />
                </Grid>
                <Grid item xs={12} md={8}>
                    <DishList
                        selectedCategories={selectedCategories}
                        pageType="menu"
                        dishes={dishes}
                        coffeeShopId={coffeeShopId}
                        tableId={tableId}
                    />
                </Grid>
            </Grid>
            <Footer />
        </div>
    );
}

export default Menu;
