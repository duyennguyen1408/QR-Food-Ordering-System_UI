import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slice/CategorySlice";
import {
    Container,
    Typography,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Box,
    Grid,
} from "@mui/material";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";
const CategoryList = ({ onCategoryChange }) => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(
        (state) => state.categories
    );

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    if (loading) {
        return <LoadingContent />;
    }

    if (error) {
        return (
            <Container sx={{ p: "30px" }}>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ p: { xs: "30px 25px", md: "30px 20px" } }}>
            <Typography
                variant="h2"
                sx={{
                    fontSize: "22px",
                    color: "#000000",
                    fontWeight: 600,
                    borderBottom: "2px solid rgba(6, 36, 97, 0.1)",
                    paddingBottom: "25px",
                    marginBottom: "30px",
                    fontFamily: "Roboto",
                }}
            >
                Categories
            </Typography>
            <Grid container spacing={2}>
                {categories.map((category) => (
                    <Grid item xs={12} key={category.id}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={category.selected}
                                    onChange={() =>
                                        onCategoryChange(category.id)
                                    }
                                    color="default"
                                    sx={{
                                        padding: "0",
                                        position: "absolute",
                                        left: 0,
                                    }}
                                />
                            }
                            label={category.categoryName}
                            sx={{
                                display: "block",
                                position: "relative",
                                left: 25,
                                paddingLeft: "40px",
                                marginBottom: "20px",
                                cursor: "pointer",
                                fontSize: "18px",
                                userSelect: "none",
                                color: "#232323",
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CategoryList;
