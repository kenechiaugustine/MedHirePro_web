import { HiOutlineCheckCircle } from 'react-icons/hi';

const WhyMedHirePro = () => {
    // Data array for the comparison table
    const comparisonData = [
        {
            feature: 'License Verification',
            medhirepro: 'Automated API Sync',
            general: 'Manual/Self-reported',
            isHighlight: false,
        },
        {
            feature: 'Medical specialty Filters',
            medhirepro: 'Clinical Sub-specialties',
            general: 'Basic Keywords',
            isHighlight: false,
        },
        {
            feature: 'Compliance Tracking',
            medhirepro: '24/7 Active Monitoring',
            general: 'None',
            isHighlight: false,
        },
        {
            feature: 'Average Time-to-Hire',
            medhirepro: '12 - 14 Days',
            general: '45 - 60 Days',
            isHighlight: true, // Triggers the solid dark blue background
        },
    ];

    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight mb-4">
                        Why MedHirePro?
                    </h2>
                    <p className="text-slate-500 text-[15px] sm:text-base">
                        Comparing specialized recruitment vs. generalist boards.
                    </p>
                </div>

                {/* 
          Table Wrapper 
          Uses overflow-x-auto so mobile users can swipe to view the full table seamlessly 
        */}
                <div className="w-full overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="min-w-[768px] flex flex-col">

                        {/* Table Header Row */}
                        <div className="flex items-stretch mb-2">
                            <div className="w-[30%] py-4 pr-4 flex items-center">
                                <span className="text-[11px] font-bold text-slate-500 tracking-[0.15em] uppercase">
                                    Feature
                                </span>
                            </div>
                            <div className="w-[35%] bg-[#0a46a1] rounded-xl py-4 px-6 flex items-center shadow-md z-10">
                                <span className="text-[11px] font-bold text-white tracking-[0.15em] uppercase">
                                    MedHirePro
                                </span>
                            </div>
                            <div className="w-[35%] bg-[#f4f8fc] rounded-l-xl py-4 px-6 flex items-center">
                                <span className="text-[11px] font-bold text-slate-600 tracking-[0.15em] uppercase">
                                    General Job Boards
                                </span>
                            </div>

                        </div>

                        {/* Table Data Rows */}
                        {comparisonData.map((row, index) => (
                            <div key={index} className="flex items-center group">

                                {/* Feature Column */}
                                <div className="w-[30%] py-6 pr-4 border-b border-gray-100 font-bold text-[#0a192f] text-[15px]">
                                    {row.feature}
                                </div>

                                {/* MedHirePro Column (Floating Cards) */}
                                <div className="w-[35%] py-2 pl-4">
                                    {row.isHighlight ? (
                                        // Highlighted Row (Solid Blue)
                                        <div className="bg-[#0a46a1] text-white rounded-xl py-4 px-6 font-bold text-[15px] flex items-center shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                                            {row.medhirepro}
                                        </div>
                                    ) : (
                                        // Standard Row (Light Blue with Checkmark)
                                        <div className="bg-[#eef3fc] text-[#0b5cd5] rounded-xl py-4 px-6 font-bold text-[15px] flex items-center gap-2.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                                            <HiOutlineCheckCircle className="w-4 h-4 shrink-0 stroke-2" />
                                            {row.medhirepro}
                                        </div>
                                    )}
                                </div>

                                {/* General Job Boards Column */}
                                <div className="w-[35%] py-6 px-6 border-b border-gray-100 text-slate-600 text-[15px]">
                                    {row.general}
                                </div>



                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhyMedHirePro;