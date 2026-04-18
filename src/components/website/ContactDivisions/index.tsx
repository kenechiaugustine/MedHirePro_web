import { Link } from 'react-router-dom';
import { HiArrowRight, HiShieldCheck, HiOfficeBuilding } from 'react-icons/hi';
import { WEBSITE_ROUTES } from '../../../pages/website/routes.enum';

const ContactDivisions = () => {
    const divisions = [
        {
            id: 1,
            label: 'SPECIALIZED DIVISION',
            title: 'Professional Verifications',
            description: 'Dedicated support for medical licensing, credentialing, and background verification processes for clinicians.',
            linkText: 'Verification Portal',
            linkTo: WEBSITE_ROUTES.SIGNUP,
            theme: 'purple',
            icon: <HiShieldCheck className="w-16 h-16 text-slate-100" />
        },
        {
            id: 2,
            label: 'GROWTH DIVISION',
            title: 'Institutional Sales',
            description: 'Strategic staffing solutions for hospitals, clinics, and health systems looking for premium medical talent.',
            linkText: 'Request a Demo',
            linkTo: WEBSITE_ROUTES.SIGNUP,
            theme: 'teal',
            icon: <HiOfficeBuilding className="w-16 h-16 text-slate-100" />
        }
    ];

    // Map our themes to specific tailwind classes for consistency
    const themeStyles = {
        purple: {
            text: 'text-[#4631ab]',
            border: 'bg-[#4631ab]',
        },
        teal: {
            text: 'text-[#066b77]',
            border: 'bg-[#066b77]',
        }
    };

    return (
        <section className="bg-[#fcfdfe] pb-16 sm:pb-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Grid Layout - items-stretch ensures equal height cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">

                    {divisions.map((div) => {
                        const currentTheme = themeStyles[div.theme as keyof typeof themeStyles];

                        return (
                            <div
                                key={div.id}
                                className="relative bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full overflow-hidden group transition-transform duration-300 hover:-translate-y-1"
                            >

                                {/* Decorative Faint Background Icon (Top Right) */}
                                <div className="absolute top-8 right-8 pointer-events-none transition-transform duration-300 group-hover:scale-110">
                                    {div.icon}
                                </div>

                                {/* Thick Floating Left Border Accent */}
                                <div className={`absolute left-0 top-10 bottom-10 w-1.5 rounded-r-md ${currentTheme.border}`}></div>

                                {/* Card Content */}
                                <div className="relative z-10 flex flex-col flex-grow">
                                    <span className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${currentTheme.text}`}>
                                        {div.label}
                                    </span>

                                    <h3 className="text-2xl font-bold text-[#0a192f] mb-4 pr-12">
                                        {div.title}
                                    </h3>

                                    {/* flex-grow ensures the button is always pushed to the bottom */}
                                    <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed flex-grow pr-4">
                                        {div.description}
                                    </p>

                                    {/* Action Link */}
                                    <Link
                                        to={div.linkTo}
                                        className={`mt-8 inline-flex items-center gap-2 text-[14px] font-bold ${currentTheme.text} hover:gap-3 transition-all w-fit`}
                                    >
                                        {div.linkText} <HiArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
};

export default ContactDivisions;