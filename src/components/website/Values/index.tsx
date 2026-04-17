import React from 'react';
import { BsShieldCheck, BsLightningFill } from 'react-icons/bs';
import { BiTargetLock } from 'react-icons/bi';

// --- SUB-COMPONENT: ValueCard ---
// Defined inside the same file for local scoping and reuse
interface ValueCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    theme: 'cyan' | 'blue' | 'purple';
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon, theme }) => {
    // Map themes to specific Tailwind color classes to match the design perfectly
    const themeStyles = {
        cyan: {
            line: 'bg-[#0891b2]',    // Darker cyan for the left border
            iconBg: 'bg-[#38bdf8]',  // Lighter cyan/blue for the icon box
            iconColor: 'text-[#082f49]' // Dark color for the shield icon
        },
        blue: {
            line: 'bg-[#1e3a8a]',
            iconBg: 'bg-[#0b5cd5]',
            iconColor: 'text-white'
        },
        purple: {
            line: 'bg-[#4c1d95]',
            iconBg: 'bg-[#7c3aed]',
            iconColor: 'text-white'
        }
    };

    const currentTheme = themeStyles[theme];

    return (
        <div className="relative bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full transition-transform duration-300 hover:-translate-y-1">

            {/* Thick Floating Left Border Accent */}
            {/* Notice it uses top-10 and bottom-10 so it doesn't touch the corners */}
            <div className={`absolute left-0 top-10 bottom-10 w-1.5 rounded-r-md ${currentTheme.line}`}></div>

            {/* Icon Container */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm ${currentTheme.iconBg}`}>
                <span className={`text-xl ${currentTheme.iconColor}`}>
                    {icon}
                </span>
            </div>

            {/* Card Content */}
            <h3 className="text-xl font-bold text-[#0a192f] mb-3">
                {title}
            </h3>
            <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed flex-grow">
                {description}
            </p>

        </div>
    );
};


// --- MAIN SECTION COMPONENT ---
const Values = () => {
    // Data array for easy rendering
    const valuesData: ValueCardProps[] = [
        {
            title: 'Integrity',
            description: 'Radical transparency in credentials and reporting. We believe trust is the primary currency of healthcare.',
            icon: <BsShieldCheck />,
            theme: 'cyan',
        },
        {
            title: 'Precision',
            description: 'Not just a match, but the right match. We use 14 unique clinical data points to pair talent with tasks.',
            icon: <BiTargetLock />,
            theme: 'blue',
        },
        {
            title: 'Efficiency',
            description: 'Time saved is lives saved. Our automated workflows eliminate the friction of traditional medical recruitment.',
            icon: <BsLightningFill />,
            theme: 'purple',
        },
    ];

    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight mb-4">
                        Values of The Digital Clinician
                    </h2>
                    <p className="text-slate-500 text-[15px] sm:text-base leading-relaxed">
                        Our operating system is built on these three fundamental pillars, ensuring every
                        interaction meets the highest clinical standards.
                    </p>
                </div>

                {/* Grid Layout for Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                    {valuesData.map((value, index) => (
                        <ValueCard
                            key={index}
                            title={value.title}
                            description={value.description}
                            icon={value.icon}
                            theme={value.theme}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Values;