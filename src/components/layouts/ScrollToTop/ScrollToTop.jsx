import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        const handleLoad = () => {
            window.scrollTo(0, 0);
        };

        window.addEventListener("load", handleLoad);

        return () => {
            window.removeEventListener("load", handleLoad);
        };
    }, [pathname]);

    return null;
};

export default ScrollToTop;
