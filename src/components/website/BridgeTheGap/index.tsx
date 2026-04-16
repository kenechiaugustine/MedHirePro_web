import { FaStethoscope } from 'react-icons/fa';
import { MdHub } from 'react-icons/md';

const BridgingTheGap = () => {
    return (
        <section className="bg-[#f4f8fc] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Grid Container - items-stretch ensures equal height columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

                    {/* LEFT COLUMN: Text Content (Spans 4 cols on Desktop) */}
                    <div className="lg:col-span-4 flex flex-col justify-center mb-8 lg:mb-0">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight">
                            Bridging the Gap
                        </h2>

                        {/* Thick Blue Underline */}
                        <div className="w-14 h-1.5 bg-[#0b5cd5] mt-4 mb-6 rounded-full"></div>

                        <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed">
                            Medical staffing is broken. Institutions face chronic shortages while talented
                            clinicians struggle with fragmented job markets. MedHirePro.ng was built to
                            bridge this divide through surgical efficiency.
                        </p>
                    </div>

                    {/* RIGHT COLUMN: Cards Container (Spans 8 cols on Desktop) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                        {/* CARD 1: For Institutions */}
                        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full transition-transform duration-300 hover:-translate-y-1">
                            {/* Icon */}
                            <div className="mb-6">
                                <MdHub className="w-6 h-6 text-[#0b5cd5]" />
                            </div>

                            <h3 className="text-xl font-bold text-[#0a192f] mb-4">
                                For Institutions
                            </h3>

                            <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed flex-grow">
                                Access a pre-vetted network of specialists ready to deploy within 48 hours,
                                reducing vacancy times by 65%.
                            </p>
                        </div>

                        {/* CARD 2: For Clinicians */}
                        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full transition-transform duration-300 hover:-translate-y-1">
                            {/* Icon */}
                            <div className="mb-6">
                                {/* make the size smaller */}
                                <FaStethoscope className="w-6 h-6 text-[#0b5cd5]" />
                            </div>

                            <h3 className="text-xl font-bold text-[#0a192f] mb-4">
                                For Clinicians
                            </h3>

                            <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed flex-grow">
                                Your expertise deserves premium placement. We match your specific sub-specialties
                                with high-impact opportunities.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default BridgingTheGap;