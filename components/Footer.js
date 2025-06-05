"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
    const fadeVariant = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.6,
                duration: 0.7,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.footer
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="text-white py-12 mt-20 relative overflow-hidden"
        >
            <div className="absolute inset-0 z-0">
                <Image
                    src="/background/footer/lightleaks.png"
                    alt="Footer background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="opacity-100"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center mb-4">
                            <div className="mr-3">
                                <Image
                                    src="/logo/logo.webp"
                                    alt="Whale Xe Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-cyan-300">
                                Whale Xe
                            </h2>
                        </div>
                        <p className="text-green-100 text-sm leading-relaxed">
                            Whale Xe is dedicated to making your car rental experience smooth, affordable, and enjoyable.
                            Travel with confidence and comfort.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            {["facebook", "twitter", "instagram", "youtube", "linkedin"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="text-teal-50 hover:text-white transition-colors duration-300"
                                    aria-label={social}
                                >
                                    <div className="w-7 h-7 bg-green-600/50 hover:bg-green-500 rounded-full flex items-center justify-center transition-all duration-300">
                                        <Image
                                            src={`/social-icons/${social}.svg`}
                                            alt={social}
                                            width={14}
                                            height={14}
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                            <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {["Home", "Rentals", "Services", "Blog", "Contact"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-green-100 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2"></span>
                            Contact Us
                        </h3>
                        <ul className="space-y-4 text-green-100 text-sm">
                            <li className="flex items-start">
                                <div className="mt-0.5 mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                                    <Image src="/icons/FooterIconSocial/map-marker.webp" alt="Address" width={20} height={20} />
                                </div>
                                <span className="leading-relaxed">158a Lê Lợi, Hải Châu 1, Hải Châu, Đà Nẵng</span>
                            </li>
                            <li className="flex items-center">
                                <div className="mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                                    <Image src="/icons/FooterIconSocial/phone.webp" alt="Phone" width={16} height={16} />
                                </div>
                                <span>+84 0236 3738 399</span>
                            </li>
                            <li className="flex items-center">
                                <div className="mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                                    <Image src="/icons/FooterIconSocial/mail.webp" alt="Email" width={16} height={16} />
                                </div>
                                <span>contact@whalexe.com</span>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2"></span>
                            Newsletter
                        </h3>
                        <p className="text-green-100 text-sm leading-relaxed">
                            Subscribe to our newsletter for the latest offers and news.
                        </p>
                        <div className="space-y-3">
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="px-3 py-2.5 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white-800 flex-1 text-sm border-0 placeholder-white"
                                />
                                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-r-lg text-sm font-medium transition-all duration-300 whitespace-nowrap">
                                    <i className="fas fa-paper-plane mr-1"></i> Subscribe
                                </button>
                            </div>
                            <div className="flex items-start">
                                <input type="checkbox" id="terms" className="mt-1 mr-2 accent-green-400" />
                                <label htmlFor="terms" className="text-green-100 text-xs leading-relaxed">
                                    I agree to the{" "}
                                    <a href="#" className="text-green-300 hover:text-white hover:underline transition-colors duration-300">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-green-400/30 mt-12 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        <div className="text-green-100 text-sm order-2 lg:order-1">
                            © {new Date().getFullYear()} Whale Xe. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 lg:order-2">
                            <a href="#" className="text-green-100 hover:text-white text-sm transition-colors duration-300">
                                Terms & Conditions
                            </a>
                            <a href="#" className="text-green-100 hover:text-white text-sm transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-green-100 hover:text-white text-sm transition-colors duration-300">
                                FAQ
                            </a>
                        </div>
                        <div className="order-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-green-100 text-xs mr-2">We accept:</span>
                                <div className="flex space-x-2">
                                    <Image src="/logo/LogoPaymentFooter/visa.png" alt="Visa" width={32} height={20} className="h-5 object-contain" />
                                    <Image src="/logo/LogoPaymentFooter/logo-momo-png-4.png" alt="Momo" width={32} height={20} className="h-5 object-contain" />
                                    <Image src="/logo/LogoPaymentFooter/paypal.png" alt="Paypal" width={32} height={20} className="h-5 object-contain" />
                                    <Image src="/logo/LogoPaymentFooter/deposit.png" alt="Bank Transfer" width={32} height={20} className="h-5 object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}