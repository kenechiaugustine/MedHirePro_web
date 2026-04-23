import { HiOutlineX, HiCheck } from 'react-icons/hi';

const InstituteVetting = () => {
    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT COLUMN: Text Content */}
                    <div className="max-w-2xl">

                        {/* Main Heading */}
                        <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0a192f] leading-[1.15] tracking-tight mb-6">
                            Stop Wasting Months on <span className="text-[#4631ab]">Manual Vetting.</span>
                        </h2>

                        {/* Paragraph */}
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-10">
                            Traditional recruitment in Nigeria involves weeks of back-and-forth
                            phone calls, manual document verification, and the risk of
                            unverified personnel. MedHirePro flips the script.
                        </p>

                        {/* Comparison List */}
                        <div className="space-y-6 sm:space-y-8">

                            {/* The Old Way */}
                            <div className="flex gap-4 sm:gap-5 items-start">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#fee2e2] text-[#ef4444] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                    <HiOutlineX className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h4 className="text-[15px] sm:text-base font-bold text-[#0a192f] mb-1">
                                        The Old Way
                                    </h4>
                                    <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed">
                                        Manual license checks, fake certificates, and 60+ days time-to-hire.
                                    </p>
                                </div>
                            </div>

                            {/* The MedHirePro Way */}
                            <div className="flex gap-4 sm:gap-5 items-start">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#38bdf8] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                    <HiCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h4 className="text-[15px] sm:text-base font-bold text-[#0a192f] mb-1">
                                        The MedHirePro Way
                                    </h4>
                                    <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed">
                                        Instant API-level verification with MDCN, NMCN, and PCN databases.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT COLUMN: Visual Composition */}
                    <div className="relative w-full mt-10 lg:mt-0">

                        {/* Soft Blue Background Container */}
                        <div className="relative w-full bg-[#f4f8fc] rounded-[2.5rem] h-[350px] sm:h-[450px] flex items-center p-4 sm:p-10 lg:p-12">

                            {/* Main White Verification Card */}
                            <div className="relative z-10 w-[95%] sm:w-[85%] bg-white rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] border-b-[5px] border-[#066b77] p-5 sm:p-7">

                                {/* Card Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[#4631ab] text-[13px] sm:text-[14px] font-bold">
                                        Candidate Verification
                                    </span>
                                    <span className="bg-[#38bdf8] text-white text-[9px] sm:text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase">
                                        Verified
                                    </span>
                                </div>

                                {/* Card Profile */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150"
                                        alt="Dr. Chidi Okoro"
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-100 shadow-sm"
                                    />
                                    <div>
                                        <h4 className="text-[#0a192f] font-bold text-[15px] sm:text-base mb-0.5">
                                            Dr. Chidi Okoro
                                        </h4>
                                        <p className="text-slate-500 text-[11px] sm:text-[12px]">
                                            Consultant Surgeon | Folio: 44921
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Overlapping Purple 'Speed Insight' Card */}
                            <div className="absolute z-20 -bottom-6 right-2 sm:bottom-6 sm:-right-6 lg:-right-8 bg-[#4631ab] rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(70,49,171,0.3)] w-[220px] sm:w-[260px] transition-transform duration-300 hover:-translate-y-2">
                                <span className="text-white/80 text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase block mb-2">
                                    Speed Insight
                                </span>
                                <div className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                                    4.2 Seconds
                                </div>
                                <p className="text-[#d8b4fe] text-[11px] sm:text-[12px] leading-snug">
                                    Average time for regulatory verification
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InstituteVetting;