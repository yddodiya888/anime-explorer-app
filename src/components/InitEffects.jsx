"use client";
import React, { useEffect } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCountryList } from "@/store/features/projectSlice";


export default function InitEffects({ countryList }) {
    const dispatch = useDispatch();
    const pathname = usePathname();

    // Redux: Set country list
    useEffect(() => {
        if (countryList) {
            let CountryList = countryList.filter(
                (country) => country.phonecode !== "92"
            );
            dispatch(setCountryList(CountryList));
        }
    }, [countryList, dispatch]);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    // Fancybox & AOS init
    useEffect(() => {
        const timer = setTimeout(() => {
            import("@fancyapps/ui").then(({ Fancybox }) => {
                Fancybox.bind("[data-fancybox]", {
                    Thumbs: {
                        autoStart: false,
                        type: "modern",
                    },
                    Carousel: { infinite: true },
                    Toolbar: true,
                });
            });

            return () => {
                if (typeof Fancybox !== "undefined") {
                    Fancybox.destroy();
                }
            };
        }, 500);

        AOS.init({
            duration: 1000,
            once: true,
        });

        return () => clearTimeout(timer);
    }, []);

    return null;
}
