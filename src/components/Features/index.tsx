import { Link } from 'react-router-dom';

const Features = () => {
    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Tailored for the Medical Community
                    </h2>
                    <p className="mt-4 text-slate-500 text-[15px] sm:text-base leading-relaxed">
                        Whether you&apos;re looking for your next career move or building a world-class clinical team,
                        we have the tools you need.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* CARD 1: For Medical Professionals */}
                    <div className="relative bg-white rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 p-8 sm:p-10 flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                        {/* Thick Left Border Accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#066b77]"></div>

                        {/* Icon Box */}
                        <div className="w-14 h-14 bg-[#e6f2f3] rounded-2xl flex items-center justify-center mb-8">
                            <svg className="w-7 h-7 text-[#066b77]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                <circle cx="18" cy="18" r="3" fill="#e6f2f3" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 19l2 2 4-4" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-[#0a192f] mb-8">
                            For Medical Professionals
                        </h3>

                        {/* Features List */}
                        <div className="space-y-6 flex-grow">

                            {/* List Item */}
                            <div className="flex gap-4">
                                <svg className="w-6 h-6 text-[#066b77] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#0a192f]">Find verified jobs</h4>
                                    <p className="text-sm text-slate-500 mt-1">Access exclusive openings at accredited hospitals nationwide.</p>
                                </div>
                            </div>

                            {/* List Item */}
                            <div className="flex gap-4">
                                <svg className="w-6 h-6 text-[#066b77] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#0a192f]">Manage credentials</h4>
                                    <p className="text-sm text-slate-500 mt-1">One digital vault for all your licenses and certifications.</p>
                                </div>
                            </div>

                            {/* List Item */}
                            <div className="flex gap-4">
                                <svg className="w-6 h-6 text-[#066b77] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#0a192f]">Career growth</h4>
                                    <p className="text-sm text-slate-500 mt-1">Personalized matches based on your specialty and location.</p>
                                </div>
                            </div>

                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/signup"
                            className="mt-10 block w-full bg-[#066b77] hover:bg-[#055a64] text-white text-center font-medium py-3.5 rounded-xl transition-colors duration-200"
                        >
                            Get Started
                        </Link>
                    </div>


                    {/* CARD 2: For Institutions */}
                    <div className="relative bg-white rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 p-8 sm:p-10 flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                        {/* Thick Left Border Accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#4631ab]"></div>

                        {/* Icon Box */}
                        <div className="w-14 h-14 bg-[#edeafe] rounded-2xl flex items-center justify-center mb-8">
                            <svg className="w-7 h-7 text-[#4631ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-[#0a192f] mb-8">
                            For Institutions
                        </h3>

                        {/* Features List */}
                        <div className="space-y-6 flex-grow">

                            {/* List Item */}
                            <div className="flex gap-4">
                                <svg className="w-6 h-6 text-[#4631ab] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#0a192f]">Hire verified talent</h4>
                                    <p className="text-sm text-slate-500 mt-1">Every candidate&apos;s MDCN/NMCN status is pre-vetted.</p>
                                </div>
                            </div>

                            {/* List Item */}
                            <div className="flex gap-4">
                                <svg className="w-6 h-6 text-[#4631ab] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#0a192f]">ATS management</h4>
                                    <p className="text-sm text-slate-500 mt-1">Modern software to manage your entire recruitment pipeline.</p>
                                </div>
                            </div>

                            {/* List Item */}
                            <div className="flex gap-4">
                                <svg className="w-6 h-6 text-[#4631ab] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#0a192f]">Recruitment efficiency</h4>
                                    <p className="text-sm text-slate-500 mt-1">Reduce time-to-hire by 60% with AI matching.</p>
                                </div>
                            </div>

                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/signup"
                            className="mt-10 block w-full bg-[#4631ab] hover:bg-[#39288c] text-white text-center font-medium py-3.5 rounded-xl transition-colors duration-200"
                        >
                            Post a Job
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;