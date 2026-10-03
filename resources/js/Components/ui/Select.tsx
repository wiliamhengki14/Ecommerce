import { SelectHTMLAttributes } from 'react';

interface Option {
    value: string;
    label: string
}

interface PropTypes extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    name: string;
    id: string;
    required?: boolean;
    className?: string;
    option : Option[];
    error?: string;
}

const Select = (props: PropTypes) => {
    const {label, name, id, required, className, option, error} = props;
    return (
        <label htmlFor={id} className='flex flex-col gap-1 font-[700]'>
            {label}
            <select required={required} className={`${className} px-3 py-3 rounded-xl border border-[#1c1c1c]`} {...props}>
                <option value="">-- Pilih Kategori --</option>
                {option.map((item: Option) => (
                    <option key={item.value} value={item.value} >{item.label}</option>
                ))}
            </select>
            {error && (
                <span className="text-red-500 text-xs font-normal">
                    {error}
                </span>
            )}
        </label>
    )
}

export default Select;