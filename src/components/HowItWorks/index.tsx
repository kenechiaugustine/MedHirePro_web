const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            title: 'Create Profile',
            description: 'Fill in your clinical details, upload your CV, and define your career preferences in minutes.',
            image: 'https://placehold.co/600x400/115e59/ccfbf1?text=Create+Profile',
        },
        {
            number: '02',
            title: 'Verify Credentials',
            description: 'Our system automatically validates your license with relevant medical boards to build trust.',
            image: 'https://placehold.co/600x400/854d0e/fef08a?text=Verify+Credentials',
        },
        {
            number: '03',
            title: 'Get Matched',
            description: 'Receive interview requests from top institutions that match your skills and expectations.',
            image: 'https://placehold.co/600x400/1e3a8a/dbeafe?text=Get+Matched',
        },
    ];

    return (
        <section className="bg-[#f4f8fc] py-16 sm:py-24 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-16 sm:mb-20">
                    <h4 className="text-[13px] font-bold text-[#0b5cd5] tracking-[0.08em] uppercase mb-2">
                        Simple Process
                    </h4>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        How It Works
                    </h2>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 lg:gap-12 relative z-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col relative group">

                            {/* Giant Faint Number Background */}
                            <div className="absolute -top-12 -left-6 text-[120px] lg:text-[140px] font-black text-white/80 leading-none select-none z-[-1]">
                                {step.number}
                            </div>

                            {/* Text Content */}
                            <div className="mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f] mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 text-[15px] leading-relaxed max-w-[90%]">
                                    {step.description}
                                </p>
                            </div>

                            {/* Image Container with inner padding */}
                            <div className="mt-auto bg-[#e5eeff] p-3 sm:p-4 rounded-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg shadow-blue-900/5">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full aspect-[3/2] md:aspect-[4/3] lg:aspect-[3/2] object-cover rounded-xl shadow-sm"
                                />
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;