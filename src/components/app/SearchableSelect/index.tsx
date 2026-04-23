import React, { useState, useRef, useEffect } from 'react';
import { MdWorkOutline, MdSearch, MdKeyboardArrowDown, MdCheck } from 'react-icons/md';

interface Option {
    label: string;
    value: string;
    group?: string;
}

interface SearchableSelectProps {
    label?: string;
    placeholder?: string;
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    id?: string;
    focusColor?: string;
    icon?: React.ReactNode;
}

const SearchableSelect = ({
    label = 'Select Option',
    placeholder = 'Search or select...',
    options,
    value,
    onChange,
    id = 'searchable-select',
    focusColor = '#0b5cd5',
    icon = <MdWorkOutline className="text-lg" />,
}: SearchableSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.group && option.group.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const selectedOption = options.find(opt => opt.value === value);

    // Handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    handleSelect(filteredOptions[highlightedIndex].value);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    // Group options by group property
    const groupedOptions: { [key: string]: Option[] } = {};
    filteredOptions.forEach(option => {
        const group = option.group || 'Other';
        if (!groupedOptions[group]) {
            groupedOptions[group] = [];
        }
        groupedOptions[group].push(option);
    });

    return (
        <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
            <label htmlFor={id} className="text-[12px] font-bold text-[#0a192f]">
                {label}
            </label>

            <div
                className="relative flex items-center cursor-pointer"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setTimeout(() => inputRef.current?.focus(), 0);
                }}
            >
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    {icon}
                </div>

                <div
                    className={`w-full bg-[#f4f8fc] text-[14px] text-slate-700 rounded-lg pl-10 pr-10 py-3 outline-none transition-all border border-transparent ${isOpen ? 'bg-white border-[#0b5cd5]/30' : ''}`}
                    style={{
                        boxShadow: isOpen ? `0 0 0 3px ${focusColor}33` : '',
                        borderColor: isOpen ? `${focusColor}4d` : 'transparent',
                        backgroundColor: isOpen ? '#ffffff' : '#f4f8fc'
                    }}
                >
                    {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
                </div>

                <div className="absolute right-3.5 text-slate-400 pointer-events-none transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <MdKeyboardArrowDown className="text-xl" />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-[100] overflow-hidden flex flex-col transition-all duration-200 ease-out origin-top">
                    {/* Search Input inside dropdown */}
                    <div className="p-3 border-b border-gray-50 flex items-center gap-2">
                        <MdSearch className="text-slate-400 text-lg" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none text-[14px] text-slate-700 placeholder:text-slate-400"
                            placeholder="Search specialty..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setHighlightedIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-[300px] overflow-y-auto py-2 scrollbar-hide">
                        {Object.entries(groupedOptions).length > 0 ? (
                            Object.entries(groupedOptions).map(([group, opts]) => (
                                <div key={group}>
                                    <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-gray-50/50">
                                        {group}
                                    </div>
                                    {opts.map((option) => {
                                        const globalIndex = filteredOptions.indexOf(option);
                                        const isSelected = value === option.value;
                                        const isHighlighted = highlightedIndex === globalIndex;

                                        return (
                                            <div
                                                key={option.value}
                                                className={`px-4 py-2.5 text-[14px] cursor-pointer flex items-center justify-between transition-colors
                                                    ${isHighlighted ? 'bg-[#0b5cd5]/5 text-[#0b5cd5]' : 'text-slate-600 hover:bg-slate-50'}
                                                    ${isSelected ? 'font-semibold text-[#0b5cd5]' : ''}
                                                `}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelect(option.value);
                                                }}
                                                onMouseEnter={() => setHighlightedIndex(globalIndex)}
                                            >
                                                <span>{option.label}</span>
                                                {isSelected && <MdCheck className="text-[#0b5cd5]" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-400 text-[13px]">
                                No specialties found for "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
