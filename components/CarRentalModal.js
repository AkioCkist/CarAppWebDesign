import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
    loading // thêm props này
}) => {
    const [additionalInsurance, setAdditionalInsurance] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    // Khóa scroll khi mở modal
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
                    Đang tải thông tin xe...
                </div>
            </div>,
            typeof window !== "undefined" ? document.body : null
        );
    }

    // Gallery images từ API, đảm bảo ảnh primary luôn ở đầu
    const gallery = carData.images && carData.images.length > 0
        ? [
            ...carData.images
                .slice() // clone mảng
                .sort((a, b) => {
                    if (a.is_primary && !b.is_primary) return -1;
                    if (!a.is_primary && b.is_primary) return 1;
                    return (a.display_order || 0) - (b.display_order || 0);
                })
                .map(img => img.url),
            ...Array(Math.max(0, 4 - carData.images.length)).fill(null)
        ].slice(0, 4)
        : [carData.image, null, null, null];

    // Pricing
    const basePrice = carData.base_price ? Number(carData.base_price) : 0;
    const insurance = 77250;
    const extraInsurance = additionalInsurance ? 50000 : 0;
    const total = basePrice + insurance + extraInsurance;

    // Amenities
    const amenities = carData.amenities || [];

    // Helper để lấy đúng URL ảnh
    function getImageUrl(url) {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Nếu url bắt đầu bằng /cars thì giữ nguyên, nếu không thì thêm /cars/
        if (url.startsWith('/cars/')) return url;
        return `/cars/${url.replace(/^\/+/, '')}`;
    }

    // Render modal vào cuối body để đảm bảo phủ toàn bộ trang
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
            <div className="relative w-full max-w-[1440px] mx-auto bg-white rounded-lg shadow-xl m-4 max-h-[90vh] overflow-y-auto">
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
                    <div className="w-full h-[480px] flex gap-2 p-4">
                        {/* Main Image */}
                        <div className="relative rounded-lg overflow-hidden basis-[70%]">
                            <img
                                src={getImageUrl(gallery[selectedImage])}
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
                        <div className="flex flex-col gap-2 basis-[30%]">
                            {gallery.slice(1, 4).map((img, idx) => (
                                img ? (
                                    <button
                                        key={idx + 1}
                                        className={`flex-1 rounded-lg overflow-hidden border-2 ${selectedImage === idx + 1 ? "border-green-600" : "border-gray-200"} hover:border-green-400 transition-colors`}
                                        onClick={() => setSelectedImage(idx + 1)}
                                        aria-label={`Ảnh ${idx + 2}`}
                                    >
                                        <img src={getImageUrl(img)} alt="" className="object-cover w-full h-full" />
                                    </button>
                                ) : (
                                    <div
                                        key={idx + 1}
                                        className="flex-1 rounded-lg border-2 border-gray-200 bg-gray-100"
                                    />
                                )
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
                            <hr className="my-2 border-gray-200" />
                            {/* Car Features */}
                            <div >
                                <div className="font-semibold text-lg text-gray-900 mb-3">Đặc điểm</div>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/IconDetailCarCard/Transmission.svg" alt="Truyền động" className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xs text-gray-500">Truyền động</div>
                                            <div className="text-sm">{carData.transmission}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/IconDetailCarCard/seat.svg" alt="Số ghế" className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xs text-gray-500">Số ghế</div>
                                            <div className="text-sm">{carData.seats} chỗ</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/IconDetailCarCard/fuel.svg" alt="Nhiên liệu" className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xs text-gray-500">Nhiên liệu</div>
                                            <div className="text-sm">{carData.fuel}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="/icons/IconDetailCarCard/fuelconsumption.svg" alt="Tiêu hao" className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xs text-gray-500">Tiêu hao</div>
                                            <div className="text-sm">7L/100km</div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-4 border-gray-200" />
                                <div className="mb-2">
                                    <div className="font-semibold text-gray-900 mb-1">Mô tả xe</div>
                                    <div className="text-gray-700 text-sm">{carData.description}</div>
                                </div>
                                <hr className="my-4 border-gray-200" />
                                <div>
                                    <div className="font-semibold text-gray-900 mb-1">Tiện nghi</div>
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
                            </div>

                            {/* Terms & Conditions*/}
                            <div className="mt-6">
                                <div className="text-green-700 font-semibold mb-2 flex items-center gap-2">
                                    <span>Điều khoản sử dụng</span>
                                </div>
                                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                                    {TERMS.map((t, i) => (
                                        <li key={i}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right: Pricing & Info */}
                        <div className="flex flex-col gap-6">
                            {/* Insurance Badge */}
                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                <Shield className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="font-semibold text-green-800">Bảo hiểm thuê xe</div>
                                    <div className="text-sm text-green-700">Chuyến đi có mua bảo hiểm. Khách hàng bồi thường tối đa 2.000.000 VNĐ trong trường hợp có sự cố ngoài ý muốn.</div>
                                    <button className="text-green-600 text-sm font-medium hover:underline">Xem thêm ›</button>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-bold">Giá thuê:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {basePrice.toLocaleString()} <span className="text-base font-normal text-gray-500">VNĐ/ngày</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <span>Đơn giá thuê xe</span>
                                    <span>{basePrice.toLocaleString()} VNĐ</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <span>Bảo hiểm thuê xe</span>
                                    <span>{insurance.toLocaleString()} VNĐ/ngày</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={additionalInsurance}
                                            onChange={() => setAdditionalInsurance(v => !v)}
                                            className="accent-green-600" />
                                        <span>Bảo hiểm thêm</span>
                                    </label>
                                    <span>{additionalInsurance ? "50.000 VNĐ/ngày" : "0 VNĐ"}</span>
                                </div>
                                <div className="flex items-center justify-between font-semibold border-t pt-2 mt-2">
                                    <span>Tổng cộng</span>
                                    <span className="text-green-600">{total.toLocaleString()} VNĐ</span>
                                </div>
                            </div>

                            {/* Additional Fees */}
                            <div>
                                <div className="font-semibold text-gray-900 mb-3">Phụ phí có thể phát sinh</div>
                                <div className="space-y-3">
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
        </div>,
        typeof window !== "undefined" ? document.body : null
    );
};

export default CarRentalModal;