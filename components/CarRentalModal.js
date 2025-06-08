import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
    X, Star, MapPin, Users, Fuel, Cog, Gauge, Camera, Bluetooth, RotateCcw, Circle, Package, Tablet, CreditCard, Shield, ShieldCheck, RotateCw, Zap, Radar, Sun, Map, ChevronDown, ChevronUp
} from "lucide-react";

const AMENITY_ICONS = {
    bluetooth: { icon: <img src="/icons/IconDetailCarCard/Detail/bluetooth.svg" alt="Bluetooth" className="w-5 h-5" />, label: "Bluetooth" },
    camera: { icon: <img src="/icons/IconDetailCarCard/Detail/AdventureCamera.svg" alt="Dash Camera" className="w-5 h-5" />, label: "Dash Camera" },
    airbag: { icon: <img src="/icons/IconDetailCarCard/Detail/airbag.svg" alt="Safety Airbag" className="w-5 h-5" />, label: "Safety Airbag" },
    etc: { icon: <img src="/icons/IconDetailCarCard/Detail/ETC.svg" alt="ETC" className="w-5 h-5" />, label: "ETC" },
    sunroof: { icon: <img src="/icons/IconDetailCarCard/Detail/carroof.svg" alt="Sunroof" className="w-5 h-5" />, label: "Sunroof" },
    sportMode: { icon: <img src="/icons/IconDetailCarCard/Detail/sportMode.svg" alt="Sport Mode" className="w-5 h-5" />, label: "Sport Mode" },
    tablet: { icon: <img src="/icons/IconDetailCarCard/Detail/screencar.svg" alt="Tablet Screen" className="w-5 h-5" />, label: "Tablet Screen" },
    camera360: { icon: <img src="/icons/IconDetailCarCard/Detail/camera360.svg" alt="360° Camera" className="w-5 h-5" />, label: "360° Camera" },
    map: { icon: <img src="/icons/IconDetailCarCard/Detail/map.svg" alt="GPS Navigation" className="w-5 h-5" />, label: "GPS Navigation" },
    rotateCcw: { icon: <img src="/icons/IconDetailCarCard/Detail/rearviewcamera.svg" alt="Reverse Camera" className="w-5 h-5" />, label: "Reverse Camera" },
    circle: { icon: <img src="/icons/IconDetailCarCard/Detail/tirepressure.svg" alt="Tire Pressure Sensor" className="w-5 h-5" />, label: "Tire Pressure Sensor" },
    package: { icon: <img src="/icons/IconDetailCarCard/Detail/cartrunk.svg" alt="Large Trunk" className="w-5 h-5" />, label: "Large Trunk" },
    shield: { icon: <img src="/icons/IconDetailCarCard/Detail/collisionsensor.svg" alt="Collision Sensor" className="w-5 h-5" />, label: "Collision Sensor" },
    radar: { icon: <img src="/icons/IconDetailCarCard/Detail/reversesenser.svg" alt="Reverse Sensor" className="w-5 h-5" />, label: "Reverse Sensor" },
    ChildSeat: { icon: <img src="/icons/IconDetailCarCard/Detail/childseat.svg" alt="Child Seat" className="w-5 h-5" />, label: "Child Seat" },
};
const TERMS = [
    "Use the vehicle for proper purposes only, do not use the vehicle for illegal or unlawful purposes",
    "Do not use the rental car for pawning or mortgaging",
    "Do not carry tobacco, rubber warehouse, or soap in the vehicle",
    "Do not carry banned, flammable or explosive goods in the vehicle",
    "Do not carry fruits or foods with strong odors in the vehicle",
    "When returning the vehicle, if the car is dirty or has strange odors, customers are responsible for cleaning fees",
    "Thank you sincerely, we wish you wonderful trips!",
];

const ADDITIONAL_FEES = [
    {
        label: "Distance limit fee",
        desc: "Additional fee if travel route exceeds 350km when renting for 1 day",
        value: "5.000đ/km",
    },
    {
        label: "Overtime fee",
        desc: "Additional fee if vehicle return is late. If more than 5 hours late, additional 1 day rental fee applies",
        value: "70.000đ/hour",
    },
    {
        label: "Cleaning fee",
        desc: "Additional fee when returned vehicle does not meet hygiene standards (many stains, mud, dirt, etc.)",
        value: "100.000đ",
    },
    {
        label: "Deodorization fee",
        desc: "Additional fee when returned vehicle has unpleasant odors (cigarette smell, strong food odors, etc.)",
        value: "250.000đ",
    },
];

const CarRentalModal = ({
    isOpen,
    onClose,
    carData,
    carAmenities,
    loading,
    searchData
}) => {
    const [additionalInsurance, setAdditionalInsurance] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const router = useRouter();    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    if (!isOpen) return null;
    if (loading || !carData) {
        return createPortal(
            <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center text-lg font-semibold">
                    Loading vehicle information...
                </div>
            </div>,
            typeof window !== "undefined" ? document.body : null
        );
    }

    // Gallery images: sort by order_display, get all images
    const gallery = carData.images && carData.images.length > 0
        ? carData.images
            .slice()
            .sort((a, b) => (a.order_display || 0) - (b.order_display || 0))
            .map(img => img.url)
        : [carData.image];

    // Pricing
    const basePrice = carData.base_price ? Number(carData.base_price) : 0;
    const insurance = 77250;
    const extraInsurance = additionalInsurance ? 50000 : 0;
    const total = basePrice + insurance + extraInsurance;

    // Amenities
    const amenities = carData.amenities || [];

    // Helper to get correct image URL
    function getImageUrl(url) {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // If url starts with /cars keep as is, otherwise add /cars/
        if (url.startsWith('/cars/')) return url;
        return `/cars/${url.replace(/^\/+/, '')}`;
    }

    // Helper to build booking URL with params
    function buildBookingUrl() {
        const searchDataValues = {
            carId: carData.id,
            pickupLocation: searchData?.pickupLocation || "",
            dropoffLocation: searchData?.dropoffLocation || "",
            pickupDate: searchData?.pickupDate || "",
            pickupTime: searchData?.pickupTime || "",
            dropoffDate: searchData?.dropoffDate || "",
            dropoffTime: searchData?.dropoffTime || ""
        }; const params = new URLSearchParams();
        Object.entries(searchDataValues).forEach(([key, value]) => {
            if (value) {
                params.append(key, value); // Không encode 2 lần, URLSearchParams tự xử lý
            }
        });
        return `/booking_car?${params.toString()}`;
    }

    // Render modal at end of body to ensure it covers the entire page
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
            <div className="relative w-full max-w-[1440px] mx-auto bg-white rounded-lg shadow-xl m-4 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100"
                    onClick={onClose} aria-label="Close">
                    <X className="w-6 h-6 text-gray-700" />
                </button>
                {/* Main Content */}
                <div>
                    {/* Photo Gallery - Full Width */}
                    <div className="w-full h-[480px] flex gap-2 p-4">
                        {/* Main Image */}
                        <div className="relative rounded-lg overflow-hidden basis-[70%]">
                            <img
                                src={getImageUrl(gallery[selectedImage])}
                                alt={carData.name}
                                className="object-cover w-full h-full"
                            />                            {/* View All Photos Button */}
                            <button className="absolute bottom-4 right-4 bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                                <Camera className="w-4 h-4" />
                                View all photos
                            </button>
                        </div>                        {/* Side Images: DISPLAY ALL IMAGES */}
                        <div className="flex flex-col gap-2 basis-[30%] overflow-y-auto max-h-[480px]">
                            {gallery.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`flex-1 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? "border-green-600" : "border-gray-200"} hover:border-green-400 transition-colors`}
                                    onClick={() => setSelectedImage(idx)}
                                    aria-label={`Image ${idx + 1}`}
                                    style={{ minHeight: 0, height: "calc((100% - 8px * " + (gallery.length - 1) + ") / " + gallery.length + ")" }}
                                >
                                    <img src={getImageUrl(img)} alt="" className="object-cover w-full h-full" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6 p-4 md:p-8 pt-0">
                        {/* Left: Car Info */}
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-gray-900 mb-3">{carData.name}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-semibold text-gray-900">{carData.rating}</span>
                                </div>                                <div className="flex items-center gap-1 text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span>{carData.trips} trips</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{carData.location}</span>
                                </div>
                            </div>
                            <hr className="my-2 border-gray-200" />                            {/* Car Features */}
                            <div >
                                <div className="font-semibold text-lg text-gray-900 mb-3">Features</div>
                                <div className="grid grid-cols-2 gap-4 mb-3">                                    <div className="flex items-center gap-2">
                                    <img src="/icons/IconDetailCarCard/Transmission.svg" alt="Transmission" className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <div className="text-xxs text-black font-bold">Transmission</div>
                                        <div className="text-sm text-black">{carData.transmission}</div>
                                    </div>
                                </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/IconDetailCarCard/seat.svg" alt="Seats" className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xxs text-black font-bold">Seats</div>
                                            <div className="text-sm text-black">{carData.seats} seats</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/IconDetailCarCard/fuel.svg" alt="Fuel" className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xxs text-black font-bold">Fuel</div>
                                            <div className="text-sm text-black">{carData.fuel}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/IconDetailCarCard/fuelconsumption.svg" alt="Consumption" className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xxs text-black font-bold">Consumption</div>
                                            <div className="text-sm text-black">7L/100km</div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-4 border-gray-200" />                                <div className="mb-2">
                                    <div className="font-semibold text-gray-900 mb-1">Car Description</div>
                                    <div className="text-gray-700 text-sm">{carData.description}</div>
                                </div>
                                <hr className="my-4 border-gray-200" />                                <div>
                                    <div className="font-semibold text-gray-900 mb-1">Amenities</div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {amenities.map((item) =>
                                            AMENITY_ICONS[item.name] ? (
                                                <div key={item.name} className="flex items-center gap-2 text-gray-700 text-sm">
                                                    {AMENITY_ICONS[item.name].icon}
                                                    <span>{AMENITY_ICONS[item.name].label}</span>
                                                </div>
                                            ) : (
                                                <div key={item.name} className="flex items-center gap-2 text-gray-700 text-sm">
                                                    <span>{item.name}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                <hr className="my-4 border-gray-200" />
                            </div>                            {/* Terms & Conditions*/}
                            <div className="mt-6">
                                <div className="text-green-700 font-semibold mb-2 flex items-center gap-2">
                                    <span>Terms of Use</span>
                                </div>
                                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                                    {TERMS.map((t, i) => (
                                        <li key={i}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right: Pricing & Info */}
                        <div className="flex flex-col gap-6">                            {/* Insurance Badge */}
                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                <Shield className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="font-semibold text-green-800">Car Rental Insurance</div>
                                    <div className="text-sm text-green-700">This trip includes insurance. Customer compensation is capped at 2,000,000 VND in case of unexpected incidents.</div>
                                    <button className="text-green-600 text-sm font-medium hover:underline">Learn more ›</button>
                                </div>
                            </div>                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-bold">Rental Price:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {basePrice.toLocaleString()} <span className="text-base font-normal text-gray-500">VND/day</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <span>Car rental rate</span>
                                    <span>{basePrice.toLocaleString()} VND</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <span>Car rental insurance</span>
                                    <span>{insurance.toLocaleString()} VND/day</span>
                                </div>                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={additionalInsurance}
                                            onChange={() => setAdditionalInsurance(v => !v)}
                                            className="accent-green-600" />
                                        <span>Additional insurance</span>
                                    </label>
                                    <span>{additionalInsurance ? "50.000 VND/day" : "0 VND"}</span>
                                </div>
                                <div className="flex items-center justify-between font-bold text-black border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span className="text-green-600">{total.toLocaleString()} VND</span>
                                </div>
                            </div>                            {/* Additional Fees */}
                            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                                <div className="font-semibold text-gray-900 mb-4">Possible Additional Fees</div>
                                <div className="space-y-4">
                                    {ADDITIONAL_FEES.map((fee, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">{fee.label}</span>
                                                    <span className="font-medium text-green-600">{fee.value}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{fee.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>                            {/* Action Button */}
                            <button
                                className="mt-4 w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                                onClick={() => {
                                    router.push(buildBookingUrl());
                                    onClose && onClose();
                                }}>
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        typeof window !== "undefined" ? document.body : null
    );
};

export default CarRentalModal;