import React, { useEffect } from "react";

const ViewportWidthSetter = () => {
    useEffect(() => {
        function setVw() {
            let vw = document.documentElement.clientWidth / 100;
            console.log(`Setting --vw to ${vw}px`);
            document.documentElement.style.setProperty("--vw", `${vw}px`);
        }

        setVw();
        window.addEventListener("resize", setVw);

        return () => {
            window.removeEventListener("resize", setVw);
        };
    }, []);

    return null;
};

export default ViewportWidthSetter;
