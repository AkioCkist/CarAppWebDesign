import React, { useState } from "react";
import {
    X, Star, MapPin, Users, Fuel, Cog, Gauge, Camera, Bluetooth, RotateCcw, Circle, Package, Tablet, CreditCard, Shield, ShieldCheck, RotateCw, Zap, Radar, Sun, Map, ChevronDown, ChevronUp
} from "lucide-react";

const AMENITY_ICONS = {
    bluetooth: { icon: <Bluetooth className="w-5 h-5" />, label: "Bluetooth" },
    camera: { icon: <Camera className="w-5 h-5" />, label: "Camera hành trình" },
    airbag: { icon: <ShieldCheck className="w-5 h-5" />, label: "Túi khí an toàn" },
    etc: { icon: <CreditCard className="w-5 h-5" />, label: "ETC" },
    sunroof: { icon: <Sun className="w-5 h-5" />, label: "Cửa sổ trời" },
    sportMode: { icon: <Zap className="w-5 h-5" />, label: "Chế độ thể thao" },
    tablet: { icon: <Tablet className="w-5 h-5" />, label: "Màn hình tablet" },
    camera360: { icon: <RotateCw className="w-5 h-5" />, label: "Camera 360 độ" },
    map: { icon: <Map className="w-5 h-5" />, label: "Bản đồ" },
    rotateCcw: { icon: <RotateCcw className="w-5 h-5" />, label: "Camera lùi" },
    circle: { icon: <Circle className="w-5 h-5" />, label: "Cảm biến lốp" },
    package: { icon: <Package className="w-5 h-5" />, label: "Cốp xe rộng" },
    shield: { icon: <Shield className="w-5 h-5" />, label: "Cảm biến va chạm" },
    radar: { icon: <Radar className="w-5 h-5" />, label: "Cảm biến lùi xe" },
};

const TERMS = [
    "Sử dụng xe đúng mục đích, không sử dụng xe vào mục đích phi pháp, trái pháp luật",
    "Không sử dụng xe thuê để cầm cố, thế chấp",
    "Không chở thuốc lá, nhà kho cao su, xà phòng trong xe",
    "Không chở hàng quốc cấm, dễ cháy nổ trong xe",
    "Không chở hoa quả, thực phẩm có mùi trong xe",
    "Khi trả xe, nếu xe bẩn hoặc có mùi lạ, khách hàng vui lòng chịu phí vệ sinh xe",
    "Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời!",
];

const ADDITIONAL_FEES = [
    {
        label: "Phí vượt giới hạn",
        desc: "Phụ phí phát sinh nếu lộ trình di chuyển vượt quá 350km khi thuê xe 1 ngày",
        value: "5.000đ/km",
    },
    {
        label: "Phí quá giờ",
        desc: "Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá 5 giờ, phụ phí thêm 1 ngày thuê",
        value: "70.000đ/giờ",
    },
    {
        label: "Phí vệ sinh",
        desc: "Phụ phí phát sinh khi xe hoàn trả không đảm bảo vệ sinh (nhiều vết bẩn, bùn cát, sình lầy...)",
        value: "100.000đ",
    },
    {
        label: "Phí khử mùi",
        desc: "Phụ phí phát sinh khi xe hoàn trả bị ám mùi khó chịu (mùi thuốc lá, thực phẩm nặng mùi...)",
        value: "250.000đ",
    },
];

const CarRentalModal = ({
    isOpen,
    onClose,
    carData,
    carAmenities,
}) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [additionalInsurance, setAdditionalInsurance] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    if (!isOpen || !carData) return null;

    // Fake gallery images
    const gallery = [
        carData.image,
        carData.image + "&2", // fake
        carData.image + "&3", // fake
        carData.image + "&4", // fake
    ];

    // Pricing
    const basePrice = parseInt(carData.oldPrice || "0", 10);
    const insurance = 77250;
    const extraInsurance = additionalInsurance ? 50000 : 0;
    const total = basePrice + insurance + extraInsurance;

    // Amenities
    const amenities = carAmenities[carData.id] || [];

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl m-4 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100"
                    onClick={onClose}
                    aria-label="Đóng">
                    <X className="w-6 h-6 text-gray-700" />
                </button>
                
                {/* Main Content */}
                <div>
                    {/* Photo Gallery - Full Width */}
                    <div className="w-full h-80 flex gap-2 p-4">
                        {/* Main Image */}
                        <div className="flex-1 relative rounded-lg overflow-hidden">
                            <img
                                src={gallery[selectedImage]}
                                alt={carData.name}
                                className="object-cover w-full h-full"
                            />
                            {/* View All Photos Button */}
                            <button className="absolute bottom-4 right-4 bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                                <Camera className="w-4 h-4" />
                                Xem tất cả ảnh
                            </button>
                        </div>
                        
                        {/* Side Images */}
                        <div className="w-48 flex flex-col gap-2">
                            {gallery.slice(1, 4).map((img, idx) => (
                                <button
                                    key={idx + 1}
                                    className={`flex-1 rounded-lg overflow-hidden border-2 ${selectedImage === idx + 1 ? "border-green-600" : "border-gray-200"} hover:border-green-400 transition-colors`}
                                    onClick={() => setSelectedImage(idx + 1)}
                                    aria-label={`Ảnh ${idx + 2}`}
                                >
                                    <img src={img} alt="" className="object-cover w-full h-full" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8 pt-0">
                        {/* Left: Car Info */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-3">{carData.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-semibold text-gray-900">{carData.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span>{carData.trips} chuyến</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{carData.location}</span>
                                </div>
                            </div>
                            {/* Insurance Badge */}
                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                <Shield className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="font-semibold text-green-800">Bảo hiểm thuê xe</div>
                                    <div className="text-sm text-green-700">Chuyến đi có mua bảo hiểm. Khách hàng bồi thường tối đa 2.000.000 VNĐ trong trường hợp có sự cố ngoài ý muốn.</div>
                                    <button className="text-green-600 text-sm font-medium hover:underline">Xem thêm ›</button>
                                </div>
                            </div>
                        </div>
                        {/* Right: Info */}
                        <div className="flex flex-col gap-6">
                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Giá thuê:</span>
                                    <span className="text-2xl font-bold text-green-600">{carData.priceDisplay} <span className="text-base font-normal text-gray-500">/ngày</span></span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Đơn giá thuê xe</span>
                                    <span>{basePrice.toLocaleString()} VNĐ</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Bảo hiểm thuê xe</span>
                                    <span>{insurance.toLocaleString()} VNĐ/ngày</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={additionalInsurance}
                                            onChange={() => setAdditionalInsurance(v => !v)}
                                            className="accent-green-600"
                                        />
                                        <span>Bảo hiểm thêm</span>
                                    </label>
                                    <span>{additionalInsurance ? "50.000 VNĐ/ngày" : "0 VNĐ"}</span>
                                </div>
                                <div className="flex items-center justify-between font-semibold border-t pt-2 mt-2">
                                    <span>Tổng cộng</span>
                                    <span className="text-green-600">{total.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                            {/* Car Features */}
                            <div>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Cog className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">{carData.transmission}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">{carData.seats} chỗ</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Fuel className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">{carData.fuel}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">7L/100km</span>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="font-semibold text-gray-900 mb-1">Mô tả xe</div>
                                    <div className="text-gray-700 text-sm">{carData.description}</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 mb-1">Tiện nghi</div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {amenities.map((key) =>
                                            AMENITY_ICONS[key] ? (
                                                <div key={key} className="flex items-center gap-2 text-gray-700 text-sm">
                                                    {AMENITY_ICONS[key].icon}
                                                    <span>{AMENITY_ICONS[key].label}</span>
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Terms & Conditions */}
                            <div>
                                <button
                                    className="flex items-center gap-2 text-green-700 font-semibold mb-2"
                                    onClick={() => setShowTerms((v) => !v)}
                                >
                                    <span>Điều khoản sử dụng</span>
                                    {showTerms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                {showTerms && (
                                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                                        {TERMS.map((t, i) => (
                                            <li key={i}>{t}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Additional Fees */}
                            <div>
                                <div className="font-semibold text-gray-900 mb-1">Phụ phí có thể phát sinh</div>
                                <div className="space-y-2">
                                    {ADDITIONAL_FEES.map((fee, i) => (
                                        <div key={i} className="flex flex-col text-sm">
                                            <span className="font-medium">{fee.label}: <span className="text-green-700">{fee.value}</span></span>
                                            <span className="text-gray-500">{fee.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Action Button */}
                            <button
                                className="mt-4 w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                                onClick={onClose}>
                                Chọn thuê
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarRentalModal;