const Testimonials = () => {
    // Testimonial data
    const testimonials = [
        {
            id: 1,
            name: 'Dr. Emmanuel Okoro',
            role: 'General Practitioner, Lagos',
            quote: '"MedHirePro revolutionized how I found my current residency position. The verification process was seamless, and the hospital knew they were hiring a professional from day one."',
            image: 'https://placehold.co/150x150/1e3a8a/ffffff?text=EO',
            theme: 'teal', // matches the "For Professionals" color
        },
        {
            id: 2,
            name: 'Mrs. Funmi Adeyemi',
            role: 'HR Director, St. Nicholas Hospital',
            quote: '"Recruiting verified nurses used to take weeks of background checks. With MedHirePro, we get pre-vetted candidates within days. It\'s a game-changer for our HR team."',
            image: 'https://placehold.co/150x150/4631ab/ffffff?text=FA',
            theme: 'purple', // matches the "For Institutions" color
        },
        {
            id: 3,
            name: 'Dr. Sarah Bello',
            role: 'Pediatrician, Abuja',
            quote: '"The platform is incredibly user-friendly. I uploaded my MDCN certificates once, and within a week, I had three interview requests from top-tier clinics in my area."',
            image: 'https://placehold.co/150x150/066b77/ffffff?text=SB',
            theme: 'teal',
        },
    ];

    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight text-center mb-12 sm:mb-16">
                    Trusted by the Community
                </h2>

                {/* 
          Horizontally Scrollable Container 
          Uses hide-scrollbar tricks and CSS scroll snapping for a native feel 
        */}
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden[-ms-overflow-style:none] [scrollbar-width:none]">

                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex-none w-[85vw] sm:w-[400px] md:w-[450px] snap-center bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col transition-transform duration-300 hover:-translate-y-1"
                        >

                            {/* Star Rating */}
                            <div className="flex gap-1.5 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${testimonial.theme === 'teal' ? 'text-[#066b77]' : 'text-[#4631ab]'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote text */}
                            <p className="flex-grow text-[#0a192f] font-medium text-[15px] sm:text-base italic leading-relaxed">
                                {testimonial.quote}
                            </p>

                            {/* Author Info */}
                            <div className="mt-8 flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100"
                                />
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#0a192f]">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-[13px] text-slate-500 mt-0.5">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default Testimonials;