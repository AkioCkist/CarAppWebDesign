"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCarLoading } from './CarLoading';

export default function Header() {
    const [scrollY, setScrollY] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const { startLoading, CarLoadingScreen } = useCarLoading();
    const router = useRouter();

    const handleNavigation = (href) => {
        setFadeOut(true);
        setTimeout(() => {
            if (href.startsWith("/")) {
                router.push(href);
            } else {
                window.location.href = href;
            }
        }, 200);
    };

    const handleSignInClick = (e) => {
        e.preventDefault();
        startLoading();
    };

    const handleLoadingComplete = () => {
        router.push("/signin_registration");
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const fadeVariant = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0,
                duration: 0.7,
                ease: "easeOut",
            },
        },
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black z-50 transition-opacity duration-200 pointer-events-none ${fadeOut ? "opacity-100" : "opacity-0"
                    }`}
            />
            <motion.header
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                className="fixed top-0 left-0 w-full z-30 text-white transition-opacity duration-300"
                style={{
                    opacity: scrollY > 5 ? Math.max(1 - (scrollY - 5) / 5, 0) : 1,
                    backgroundColor: scrollY > 50 ? "rgba(17, 24, 39, 0.9)" : "transparent",
                    transition: "background-color 0.3s ease, opacity 0.3s ease",
                }}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between py-4 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleNavigation("../")}
                                className="flex items-center group transition-transform duration-200 hover:scale-105"
                            >
                                <img
                                    src="/logo/logo.png"
                                    alt="Whale Xe"
                                    className="h-8 transition-all duration-200 group-hover:brightness-110"
                                />
                                <span className="text-2xl font-bold text-white ml-2 transition-all duration-200 group-hover:text-green-400">
                                    Whale Xe
                                </span>
                            </button>
                        </div>
                        <nav className="flex items-center gap-6 text-base font-medium">
                            <button
                                onClick={() => handleNavigation("../")}
                                className="text-white hover:text-green-400 transition-all duration-200 relative group"
                            >
                                Home
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                            </button>
                            <button
                                onClick={() => handleNavigation("")}
                                className="text-white hover:text-green-400 transition-all duration-200 relative group"
                            >
                                Cars
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                            </button>
                            <button
                                onClick={() => handleNavigation("")}
                                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"
                            >
                                Booking
                                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                            </button>
                            <button
                                onClick={handleSignInClick}
                                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"
                            >
                                My Account
                                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                            </button>
                            <button
                                onClick={() => handleNavigation("")}
                                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"
                            >
                                Pages
                                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                            </button>
                            <button
                                onClick={() => handleNavigation("")}
                                className="text-white hover:text-green-400 transition-all duration-200 relative group"
                            >
                                Gallery
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                            </button>
                            <button
                                onClick={() => handleNavigation("")}
                                className="text-white hover:text-green-400 transition-all duration-200 relative group flex items-center gap-1"
                            >
                                News
                                <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                            </button>
                        </nav>
                    </div>
                    <CarLoadingScreen onComplete={handleLoadingComplete} />
                </div>
            </motion.header>
        </>
    );
}