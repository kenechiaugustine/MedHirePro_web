import { Link } from 'react-router-dom';
import { WEBSITE_ROUTES } from '../../../pages/website/routes.enum';

const ProfessionalHero = () => {
    return (
        <section className="bg-[#fcfdfe] py-12 lg:py-20 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* LEFT COLUMN: Text Content */}
                    <div className="max-w-2xl">

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#0a192f] leading-[1.1] tracking-tight mb-6">
                            Your Career, <br className="hidden sm:block" />
                            <span className="text-[#0b5cd5]">Verified</span> and <br className="hidden sm:block" />
                            Elevated.
                        </h1>

                        {/* Description */}
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-[500px] mb-10">
                            Join the most trusted network of healthcare professionals
                            in Nigeria. Access exclusive opportunities at top-tier
                            institutions.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                            <Link
                                to={WEBSITE_ROUTES.SIGNUP}
                                className="bg-[#0b5cd5] hover:bg-[#094bb3] text-white px-8 py-3.5 rounded-lg font-medium text-[15px] text-center transition-colors duration-200 shadow-md shadow-blue-500/20"
                            >
                                Join the Network
                            </Link>

                            <Link
                                to={WEBSITE_ROUTES.SIGNUP}
                                className="bg-[#eaf1ff] hover:bg-[#dbe6fe] text-[#0b5cd5] px-8 py-3.5 rounded-lg font-medium text-[15px] text-center transition-colors duration-200"
                            >
                                Explore Roles
                            </Link>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Image & Floating Card */}
                    <div className="relative w-full mt-8 lg:mt-0 lg:pl-8">

                        {/* Main Image Container */}
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[450px] sm:h-[550px] lg:h-[650px] w-full z-10">
                            <img
                                src="https://placehold.co/600x400/0b5cd5/white?text=Verified+Healthcare+Professional"
                                alt="Verified Healthcare Professional"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Floating Stats Card (Overlapping bottom-left) */}
                        <div className="absolute -bottom-6 left-4 sm:-left-8 lg:-left-12 z-20 bg-white/95 backdrop-blur-sm border border-white/40 p-4 sm:p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-4 max-w-[280px] sm:max-w-[320px]">

                            {/* Cyan Verification Badge */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#38bdf8] flex items-center justify-center shrink-0 shadow-sm">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>

                            {/* Text Info */}
                            <div>
                                <div className="text-[13px] sm:text-[14px] font-bold text-[#0a192f] leading-tight">
                                    5,000+ Verified Clinicians
                                </div>
                                <div className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5">
                                    Actively hired across Nigeria
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProfessionalHero;