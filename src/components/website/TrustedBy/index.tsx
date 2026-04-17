// src/components/TrustedBy/index.tsx

const TrustedBy = () => {
    // Array of partners to easily map through them
    const partners = [
        {
            name: 'Redeemers',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
                </svg>
            ),
        },
        {
            name: 'Lagos State Health',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                </svg>
            ),
        },
        {
            name: 'Eko Hospital',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m-9 1V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            name: 'St. Nicholas',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-6.928-12l13.856 8m-13.856 0l13.856-8" />
                </svg>
            ),
        },
    ];

    return (
        <section className="bg-[#f4f7fb] py-10 sm:py-12 border-y border-gray-100 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <h3 className="text-center text-[11px] sm:text-xs font-semibold text-[#1e3a8a] tracking-[0.2em] uppercase mb-8 sm:mb-10">
                    Empowering Nigeria's Leading Health Systems
                </h3>

                {/* Marquee Container */}
                <div className="flex w-full overflow-hidden relative">

                    {/* Gradient Masks for smooth fading on left and right edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#f4f7fb] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#f4f7fb] to-transparent z-10 pointer-events-none"></div>

                    {/* First Scrolling Group */}
                    <div className="animate-marquee flex shrink-0 items-center justify-around min-w-full gap-12 sm:gap-24 pr-12 sm:pr-24">
                        {partners.map((partner, index) => (
                            <div key={`group1-${index}`} className="flex items-center gap-2.5 sm:gap-3 group cursor-default">
                                <span className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300">
                                    {partner.icon}
                                </span>
                                <span className="text-gray-500 group-hover:text-gray-700 font-bold text-base sm:text-lg tracking-wide uppercase whitespace-nowrap transition-colors duration-300">
                                    {partner.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Second Scrolling Group (Exact Duplicate for Seamless Loop) */}
                    <div aria-hidden="true" className="animate-marquee flex shrink-0 items-center justify-around min-w-full gap-12 sm:gap-24 pr-12 sm:pr-24">
                        {partners.map((partner, index) => (
                            <div key={`group2-${index}`} className="flex items-center gap-2.5 sm:gap-3 group cursor-default">
                                <span className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300">
                                    {partner.icon}
                                </span>
                                <span className="text-gray-500 group-hover:text-gray-700 font-bold text-base sm:text-lg tracking-wide uppercase whitespace-nowrap transition-colors duration-300">
                                    {partner.name}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrustedBy;