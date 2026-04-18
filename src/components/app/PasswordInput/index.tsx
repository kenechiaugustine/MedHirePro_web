import { useState } from 'react';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

interface PasswordInputProps {
    label?: string;
    placeholder?: string;
    focusColor?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
}

const PasswordInput = ({
    label = 'Password',
    placeholder = '••••••••',
    focusColor = '#0b5cd5',
    value,
    onChange,
    id = 'password',
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[12px] font-bold text-[#0a192f]">
                {label}
            </label>
            <div className="relative flex items-center">
                <HiOutlineLockClosed className="absolute left-3.5 text-slate-400 text-lg pointer-events-none" />
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-[#f4f8fc] text-[14px] text-slate-700 rounded-lg pl-10 pr-10 py-3 outline-none transition-all border border-transparent"
                    onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${focusColor}33`;
                        e.currentTarget.style.borderColor = `${focusColor}4d`;
                        e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = '#f4f8fc';
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? (
                        <HiOutlineEyeOff className="text-lg" />
                    ) : (
                        <HiOutlineEye className="text-lg" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
