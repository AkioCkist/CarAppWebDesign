import React from "react";

export default function NoResultMessage({ type, filter }) {
    let message = "No cars available for rent.";
    if (type === "filter") {
        switch (filter) {
            case "carType":
                message = "No cars of this type available.";
                break;
            case "brand":
                message = "No cars from this brand available.";
                break;
            case "seats":
                message = "No cars with this number of seats.";
                break;
            case "fuel":
                message = "No cars with this fuel type.";
                break;
            case "discount":
                message = "No cars with discounts available.";
                break;
            case "price":
                message = "No cars in this price range.";
                break;
            default:
                message = "No matching cars found.";
        }
    }
    if (type === "favorite") {
        message = "No cars in your favorites list.";
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