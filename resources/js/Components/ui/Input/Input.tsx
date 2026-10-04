import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PropTypes extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    id: string;
    name: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, PropTypes>(({
    label,
    id,
    name,
    type = 'text',
    error,
    className = '',
    icon,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-[5px] text-left">
            {label && (
                <label htmlFor={id} className="font-bold text-sm text-[#1c1c1c]">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        {icon}
                    </div>
                )}
                
                <input
                    type={inputType}
                    ref={ref}
                    id={id}
                    name={name}
                    {...props}
                    className={`w-full py-3 ${icon ? 'pl-11' : 'px-4'} ${isPassword ? 'pr-11' : 'pr-4'} rounded-xl border text-sm font-normal text-[#1c1c1c] outline-none transition duration-150 ${
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#1c1c1c] focus:ring-1 focus:ring-[#1c1c1c]'
                    } ${className}`}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-red-500 text-xs font-normal">
                    {error}
                </span>
            )}
        </div>
    );
});

export default Input;