"use client";
import { TextInputProps } from "@/app/types";
import React from "react";


const TextInput: React.FC<TextInputProps> = ({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    className = "",
}) => {
    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            <label htmlFor={id} className="mb-1 font-semibold text-gray-700">
                {label}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 duration-300 rounded-lg p-2
                   focus:outline-none focus:border-[#030925] focus:ring-2 focus:ring-[#030925]"
            />
        </div>
    );
};

export default TextInput;