import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingContent from "../../components/layouts/Loading/LoadingContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Typography, Box, Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ViewportWidthSetter from "../../components/layouts/ViewportWidthSetter/ViewportWidthSetter";
import ComboDetailModal from "../../pages/ComboDetail/ComboDetail";
import { fetchCombos } from "../../redux/slice/ComboSlice";

const useStyles = makeStyles((theme) => ({
    slideContainer: {
        height: "auto",
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    img: {
        maxWidth: "100%",
        height: "auto",
        objectFit: "cover",
        objectPosition: "center",
        transition: "transform 0.3s ease",
        cursor: "pointer",
    },
    overlay: {
        position: "absolute",
        bottom: "0",
        left: "0",
        maxWidth: "100%",
        height: "100%",
        padding: "30px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
    },
    comboName: {
        fontWeight: "700",
        color: "#fff",
    },
    comboDesc: {
        color: "#fff",
        marginBottom: "10px",
    },
    comboPrice: {
        fontWeight: "bold",
        color: "#fff",
    },
}));

function ComboList() {
    const classes = useStyles();
    const { combos, loading, error } = useSelector((state) => state.combos);
    const dispatch = useDispatch();
    const [activeCombo, setActiveCombo] = useState(null);
    const [selectedComboId, setSelectedComboId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comboData, setComboData] = useState(null);

    useEffect(() => {
        dispatch(fetchCombos());
    }, [dispatch]);

    const handleOpenModal = (comboId) => {
        setSelectedComboId(comboId);
        setIsModalOpen(true);
        const selectedCombo = combos.find((combo) => combo.id === comboId);
        setComboData(selectedCombo);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComboId(null);
        setComboData(null);
    };

    const handleMouseEnter = (index) => {
        setActiveCombo(index);
    };

    const handleMouseLeave = () => {
        setActiveCombo(null);
    };

    return (
        <div
            style={{
                width: "calc(var(--vw, 1vw) * 100)",
                overflow: "hidden",
                margin: "80px 0 75px",
            }}
        >
            <ViewportWidthSetter />
            <Box
                sx={{
                    padding: "0 30px 60px",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "38px",
                        color: "#232323",
                        mb: "15px",
                        mt: "11px",
                    }}
                >
                    The Perfect Pair
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: "#7c4b52",
                        fontSize: "16px",
                        fontWeight: "500",
                    }}
                >
                    Sweeten your coffee break or savor a delicious dessert. We
                    craft perfect pairs: coffee and treats designed to
                    complement each other.
                    <br />
                    Explore our menu of creative coffee combos and delectable
                    desserts – there's something for every taste bud!
                </Typography>
            </Box>
            <Swiper
                modules={[Pagination, A11y, Autoplay, EffectCoverflow]}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                }}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                    768: {
                        slidesPerView: 3,
                    },
                }}
                pagination={{ clickable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
                style={{
                    "--swiper-pagination-color": "#b78060",
                    "--swiper-pagination-bullet-inactive-color": "#7c4b52",
                    "--swiper-pagination-bullet-inactive-opacity": "1",
                    "--swiper-pagination-bullet-size": "14px",
                    "--swiper-pagination-bullet-horizontal-gap": "6px",
                }}
            >
                {combos.map((combo, index) => (
                    <SwiperSlide
                        key={combo.id}
                        onClick={() => handleOpenModal(combo.id)}
                    >
                        <div
                            className={classes.slideContainer}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={combo.comboImageUrl}
                                alt={combo.comboName}
                                className={classes.img}
                            />
                            {activeCombo === index && (
                                <div className={classes.overlay}>
                                    <Typography
                                        variant="h4"
                                        className={classes.comboName}
                                    >
                                        {combo.comboName}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        className={classes.comboDesc}
                                    >
                                        {combo.comboDesc}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        className={classes.comboPrice}
                                    >
                                        ${combo.comboPrice}
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={{ outline: "none" }}>
                    {isModalOpen && selectedComboId && comboData && (
                        <ComboDetailModal
                            comboId={selectedComboId}
                            closeModal={handleCloseModal}
                            isOpen={isModalOpen}
                            comboData={comboData}
                        />
                    )}
                </Box>
            </Modal>
        </div>
    );
}

export default ComboList;
