import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FilterPopup = ({ title, options, category, onClose, filters, onFilterToggle, onClearFilters, formatDisplay }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation sau khi component mount
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Đợi animation xong mới close
    };

    return (
        <div
            className={`
                fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
                transition-opacity duration-300 ease-out
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={handleClose}
        >
            <div
                className={`
                    bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden
                    transition-all duration-300 ease-out
                    ${isVisible
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-[2]'
                    }
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                        {options.map((option, index) => {
                            const isChecked = filters[category].includes(option);
                            return (
                                <label
                                    key={option}
                                    className={`
                                        flex items-center space-x-3 cursor-pointer p-3 rounded-lg
                                        transition-all duration-200 hover:bg-gray-50
                                        ${isChecked ? 'bg-green-50 border border-green-200' : 'hover:scale-[1.02]'}
                                    `}
                                >
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => onFilterToggle(category, option)}
                                            className="sr-only"
                                        />
                                        <div className={`
                                            w-5 h-5 rounded border-2 flex items-center justify-center
                                            transition-all duration-200 transform
                                            ${isChecked
                                                ? 'bg-green-500 border-green-500 scale-110'
                                                : 'border-gray-300 hover:border-green-400'
                                            }
                                        `}>
                                            {isChecked && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`
                                        font-medium transition-colors duration-200
                                        ${isChecked ? 'text-green-700' : 'text-gray-700'}
                                    `}>
                                        {formatDisplay ? formatDisplay(option) : option}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t flex space-x-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold
                                   hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02]
                                   active:scale-95 shadow-md hover:shadow-lg"
                    >
                        Áp dụng ({filters[category].length})
                    </button>
                    <button
                        onClick={() => {
                            onClearFilters(category);
                            setTimeout(handleClose, 100);
                        }}
                        className="flex-1 px-4 py-3 border-2 border-green-500 text-green-600 rounded-lg font-semibold
                                   hover:bg-green-50 transition-all duration-200 transform hover:scale-[1.02]
                                   active:scale-95"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;