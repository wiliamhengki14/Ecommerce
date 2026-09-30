
import React, { InputHTMLAttributes, forwardRef } from 'react';
// Mewarisi semua atribut HTML standar <input>
interface PropTypes extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    id: string;
    name: string;
    error?: string; // Tambahan untuk pesan validasi Laravel
}

const Input = forwardRef<HTMLInputElement, PropTypes>(({
    label,
    id,
    name,
    type = 'text',
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="flex flex-col gap-[5px] text-left">
            <label htmlFor={id} className="font-bold text-sm text-[#1c1c1c]">
                {label}
            </label>

            <input
                type={type}
                ref={ref}
                id={id}
                name={name}
                {...props}
                className={`py-3 px-4 rounded-xl border text-sm font-normal text-[#1c1c1c] outline-none transition duration-150 ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[#1c1c1c] focus:ring-1 focus:ring-[#1c1c1c]'
                } ${className}`}
            />

            {/* Render teks error otomatis jika validasi gagal */}
            {error && (
                <span className="text-red-500 text-xs font-normal">
                    {error}
                </span>
            )}
        </div>
    );
});

export default Input;