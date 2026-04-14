import { Link } from 'react-router-dom';
import professionalsImg from '../../assets/jpeg/professionals.jpg';
import { WEBSITE_ROUTES } from '../../pages/website/routes.enum';

const Hero = () => {
    return (
        <section className="relative w-full bg-[#fcfdfe] lg:min-h-[calc(100vh-80px)] flex items-center overflow-hidden">

            {/* MOBILE & TABLET BACKGROUND (Hidden on Desktop) */}
            <div className="absolute inset-0 lg:hidden z-0">
                <img
                    src={professionalsImg}
                    alt="Healthcare Professionals"
                    className="w-full h-full object-cover"
                />
                {/* White gradient overlay to ensure text readability on mobile */}
                <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* LEFT COLUMN: Text Content */}
                    <div className="max-w-full lg:max-w-2xl">

                        {/* NCDC Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e0f4f9] text-[#00838f] text-[11px] sm:text-xs font-bold tracking-wide uppercase mb-6 sm:mb-8">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            NCDC Compliant Platform
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#0a192f] leading-[1.1] tracking-tight">
                            Connecting <br className="hidden lg:block" />
                            <span className="text-[#0d47a1] italic font-bold">Verified</span>
                            <br className="lg:block" />
                            Healthcare <br className="hidden lg:block" />
                            Talent to Quality <br className="hidden lg:block" />
                            Care.
                        </h1>

                        {/* Subheading */}
                        <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-full lg:max-w-[500px] leading-relaxed">
                            The trusted recruitment platform for Nigeria's medical ecosystem. We bridge the gap between world-class clinicians and premier medical institutions.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
                            <Link
                                to={WEBSITE_ROUTES.SIGNUP}
                                className="bg-[#0b5cd5] hover:bg-[#094bb3] text-white px-6 sm:px-8 py-3.5 rounded-lg font-medium text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-blue-500/20"
                            >
                                Join as a Professional
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>

                            <Link
                                to={WEBSITE_ROUTES.SIGNUP}
                                className="bg-[#eaf1ff] hover:bg-[#dbe6fe] text-[#0b5cd5] px-6 sm:px-8 py-3.5 rounded-lg font-medium text-[15px] text-center transition-colors duration-200"
                            >
                                Recruit with Us
                            </Link>
                        </div>

                        {/* Social Proof Section */}
                        <div className="mt-10 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://placehold.co/100x100/e2e8f0/64748b?text=D1" alt="Doctor 1" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://placehold.co/100x100/cbd5e1/475569?text=D2" alt="Doctor 2" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://placehold.co/100x100/94a3b8/334155?text=D3" alt="Doctor 3" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">
                                Joined by <span className="text-slate-800 font-semibold">5,000+</span> Licensed Professionals
                            </p>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Image & Glassmorphism Card (Visible only on Desktop) */}
                    <div className="hidden lg:block relative h-full min-h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
                        {/* Main Desktop Image */}
                        <img
                            src={professionalsImg}
                            alt="Healthcare Professionals"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Glassmorphism Floating Card */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="bg-[#1e293b]/70 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-lg">

                                {/* Green Icon Box */}
                                <div className="bg-[#00796b] w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                </div>

                                {/* Card Text */}
                                <div>
                                    <h4 className="text-white font-bold text-base tracking-wide">Credential Verified</h4>
                                    <p className="text-gray-300 text-sm mt-0.5">MDCN & NMCN Authenticated</p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;