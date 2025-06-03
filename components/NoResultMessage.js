import React from "react";

export default function NoResultMessage({ type, filter }) {
    let message = "Không có xe nào đang cho thuê.";
    if (type === "filter") {
        switch (filter) {
            case "carType":
                message = "Không có loại xe này.";
                break;
            case "brand":
                message = "Không có hãng xe phù hợp.";
                break;
            case "seats":
                message = "Không có xe với số chỗ này.";
                break;
            case "fuel":
                message = "Không có xe với loại nhiên liệu này.";
                break;
            case "discount":
                message = "Không có xe đang giảm giá.";
                break;
            case "price":
                message = "Không có xe trong khoảng giá này.";
                break;
            default:
                message = "Không tìm thấy xe phù hợp.";
        }
    }
    if (type === "favorite") {
        message = "Không có xe nào trong danh sách yêu thích.";
    }
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
        </div>
    );
}