import { HiIdentification, HiTrendingUp, HiLightningBolt } from 'react-icons/hi';
import { MdStars } from 'react-icons/md';

const ProfessionalAdvantage = () => {
    const advantages = [
        {
            id: 1,
            title: 'Verified Credentialing',
            description: 'Securely store and share your MDCN/NMCN credentials with ease.',
            icon: <HiIdentification className="w-5 h-5 sm:w-6 sm:h-6" />,
        },
        {
            id: 2,
            title: 'Exclusive Opportunities',
            description: 'Access high-paying, verified roles before they hit public boards.',
            icon: <MdStars className="w-5 h-5 sm:w-6 sm:h-6" />,
        },
        {
            id: 3,
            title: 'Career Growth',
            description: 'Personalized job matching based on your specialty and goals.',
            icon: <HiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
        },
        {
            id: 4,
            title: 'Seamless Applications',
            description: 'One-click apply with your pre-verified digital profile.',
            icon: <HiLightningBolt className="w-5 h-5 sm:w-6 sm:h-6" />,
        },
    ];

    return (
        <section className="bg-[#f4f8fc] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <span className="text-[#066b77] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase block mb-3">
                        The Digital Clinician Advantage
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Precision-Engineered Career Growth
                    </h2>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

                    {advantages.map((adv) => (
                        <div
                            key={adv.id}
                            className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full transition-transform duration-300 hover:-translate-y-1"
                        >

                            {/* Floating Teal Left Border */}
                            <div className="absolute left-0 top-8 bottom-8 w-1 sm:w-1.5 rounded-r-md bg-[#066b77]"></div>

                            {/* Icon Container */}
                            <div className="w-12 h-12 bg-[#eaf1ff] text-[#0b5cd5] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                {adv.icon}
                            </div>

                            {/* Card Content */}
                            <h3 className="text-lg font-bold text-[#0a192f] mb-3">
                                {adv.title}
                            </h3>

                            <p className="text-slate-500 text-[14px] leading-relaxed flex-grow">
                                {adv.description}
                            </p>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default ProfessionalAdvantage;