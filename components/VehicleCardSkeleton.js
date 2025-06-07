import React from 'react';

const VehicleCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-200 relative h-[520px] w-full">
            {/* Favorite button skeleton */}
            <div className="absolute top-3 right-3 z-10 bg-gray-200 rounded-full p-2 w-9 h-9 animate-pulse"></div>

            {/* Image skeleton với gradient shimmer */}
            <div className="relative w-full h-80 bg-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
            </div>

            {/* Content skeleton */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
                {/* Car name */}
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>

                {/* Car details grid - giống layout thật */}
                <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-10"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>

                {/* Rating and trips */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>

                {/* Discount badge */}
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-28"></div>

                {/* Description lines */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>

                {/* Book button */}
                <div className="mt-auto pt-4">
                    <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default VehicleCardSkeleton;