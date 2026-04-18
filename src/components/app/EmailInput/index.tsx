import { HiOutlineMail } from 'react-icons/hi';

interface EmailInputProps {
    label?: string;
    placeholder?: string;
    focusColor?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
}

const EmailInput = ({
    label = 'Email',
    placeholder = 'you@example.com',
    focusColor = '#0b5cd5',
    value,
    onChange,
    id = 'email',
}: EmailInputProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[12px] font-bold text-[#0a192f]">
                {label}
            </label>
            <div className="relative flex items-center">
                <HiOutlineMail className="absolute left-3.5 text-slate-400 text-lg pointer-events-none" />
                <input
                    id={id}
                    type="email"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-[#f4f8fc] text-[14px] text-slate-700 rounded-lg pl-10 pr-4 py-3 outline-none transition-all border border-transparent"
                    style={{
                        // Inline focus ring via CSS custom property override isn't possible in Tailwind without config,
                        // so we rely on Tailwind classes with a fallback ring color passed via a data attribute.
                    }}
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
            </div>
        </div>
    );
};

export default EmailInput;
