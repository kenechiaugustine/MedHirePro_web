import { HiOutlineMail } from 'react-icons/hi';

interface EmailInputProps {
    label?: string;
    placeholder?: string;
    focusColor?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    id?: string;
    error?: string;
}

const EmailInput = ({
    label = 'Email',
    placeholder = 'you@example.com',
    focusColor = '#0b5cd5',
    value,
    onChange,
    onBlur,
    id = 'email',
    error,
}: EmailInputProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[12px] font-bold text-[#0a192f]">
                {label}
            </label>
            <div className={`relative flex items-center ${error ? 'animate-shake' : ''}`}>
                <HiOutlineMail className={`absolute left-3.5 text-lg pointer-events-none ${error ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                    id={id}
                    type="email"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full text-[14px] text-slate-700 rounded-lg pl-10 pr-4 py-3 outline-none transition-all border ${error ? 'border-red-500 bg-red-50/30' : 'bg-[#f4f8fc] border-transparent'}`}
                    style={{
                        // Inline focus ring via CSS custom property override isn't possible in Tailwind without config,
                        // so we rely on Tailwind classes with a fallback ring color passed via a data attribute.
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? '#ef4444' : focusColor}33`;
                        e.currentTarget.style.borderColor = error ? '#ef4444' : `${focusColor}4d`;
                        e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = error ? '#ef4444' : 'transparent';
                        e.currentTarget.style.backgroundColor = error ? 'rgb(254 242 242 / 0.3)' : '#f4f8fc'; // red-50/30 or default
                        if (onBlur) onBlur(e);
                    }}
                />
            </div>
            {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
        </div>
    );
};

export default EmailInput;
