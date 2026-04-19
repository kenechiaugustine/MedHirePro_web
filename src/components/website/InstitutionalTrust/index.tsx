import { MdVerifiedUser, MdShield, MdLock } from 'react-icons/md';
import institution from '../../../assets/institution.jpg';
const InstitutionalTrust = () => {
    const features = [
        {
            id: 1,
            title: 'Council Integration',
            description: 'Direct linkage with MDCN, NMCN, and PCN for credential validation.',
            icon: <MdVerifiedUser className="w-5 h-5 sm:w-6 sm:h-6" />,
        },
        {
            id: 2,
            title: 'Secure Vault',
            description: 'Bank-grade encryption for your professional sensitive data.',
            icon: <MdShield className="w-5 h-5 sm:w-6 sm:h-6" />,
        },
        {
            id: 3,
            title: 'Privacy Control',
            description: 'You decide which institutions can view your verified profile.',
            icon: <MdLock className="w-5 h-5 sm:w-6 sm:h-6" />,
        },
    ];

    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Card Container */}
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* LEFT COLUMN: Text Content */}
                        <div className="p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">

                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight mb-6 leading-tight">
                                Institutional Trust, Built-In.
                            </h2>

                            <p className="text-slate-500 text-[15px] sm:text-base leading-relaxed mb-10 lg:mb-12">
                                We bridge the gap between regulatory bodies and your next big role.
                                Our platform integrates directly with Nigerian healthcare councils for
                                real-time verification.
                            </p>

                            {/* Feature List */}
                            <div className="space-y-8">
                                {features.map((feature) => (
                                    <div key={feature.id} className="flex gap-4 sm:gap-6">
                                        {/* Icon Box */}
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e6f2f3] text-[#066b77] flex items-center justify-center shrink-0 mt-1">
                                            {feature.icon}
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <h4 className="text-[15px] sm:text-base font-bold text-[#0a192f] mb-1.5">
                                                {feature.title}
                                            </h4>
                                            <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed max-w-sm">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Image (Hidden on Mobile) */}
                        <div className="hidden md:block relative w-full h-full min-h-[500px]">
                            <img
                                src={institution}
                                alt="Doctor reviewing digital records on a tablet"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default InstitutionalTrust;