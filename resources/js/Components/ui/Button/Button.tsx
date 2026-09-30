import React, { ButtonHTMLAttributes, ReactNode } from "react";

// Mewarisi semua atribut bawaan HTML <button> (disabled, onClick, form, dll)
interface PropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    name?: string;
    id?: string;
    className?: string;
    children?: ReactNode;
    type?: 'submit' | 'reset' | 'button';
    color?: 'primer' | 'sekunder';
}

const Button = ({
    label,
    name,
    id,
    className = '',
    type = 'button',
    color = 'primer',
    children,
    disabled,
    ...props
}: PropTypes) => {
    // Layout dasar, font, border, radius, transisi, dan interaksi disabled
    const baseStyle = 'py-3 px-4 rounded-xl font-bold flex items-center justify-center border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed outline-none';

    // Varian warna primer & sekunder sesuai palet
    const colorStyle = {
        primer: 'bg-[#1c1c1c] text-white border-[#1c1c1c] hover:bg-[#333333]',
        sekunder: 'bg-white text-[#1c1c1c] border-[#1c1c1c] hover:bg-slate-100',
    };

    return (
        <button
            type={type}
            name={name}
            id={id}
            disabled={disabled}
            className={`${baseStyle} ${colorStyle[color]} ${className}`}
            {...props}
        >
            {/* Menampilkan children jika ada, jika tidak ada fallback ke prop label */}
            {children || label}
        </button>
    );
};

export default Button;