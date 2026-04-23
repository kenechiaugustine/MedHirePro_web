import { MdPeople, MdVerifiedUser } from 'react-icons/md';
import { HiOutlineTemplate } from 'react-icons/hi';
import doctor from '../../../assets/doctor-uniform-standing-smiling_688921-4354.avif';
import black from '../../../assets/portrait-black-man-doctor-healthcare-career-professional-service-smile-hospital-job-mindset-face-headshot-young-medical-person-cardiologist-with-leadership-happy-opportunity_5904.avif';
import white from '../../../assets/white.avif';
const InstituteEcosystem = () => {
    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight mb-4 leading-tight">
                        Ecosystem Designed for Scale
                    </h2>
                    <p className="text-slate-500 text-[15px] sm:text-base leading-relaxed">
                        Centralize your entire clinical recruitment workflow with tools built specifically
                        for medical HR teams.
                    </p>
                </div>

                {/* Bento Box Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">

                    {/* CARD 1: Verified Talent Pool (Spans 2 columns on Desktop/Tablet) */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between h-full group transition-shadow hover:shadow-lg">

                        <div>
                            <div className="w-12 h-12 bg-[#eaf1ff] text-[#0b5cd5] rounded-xl flex items-center justify-center mb-6">
                                <MdPeople className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-[#0a192f] mb-4">
                                Verified Talent Pool
                            </h3>
                            <p className="text-slate-500 text-[15px] leading-relaxed max-w-xl">
                                Access Nigeria's largest database of pre-vetted doctors, nurses, and specialists.
                                Every profile is rich with clinical history and active license status.
                            </p>
                        </div>

                        {/* Overlapping Avatar Group */}
                        <div className="flex items-center mt-10">
                            <div className="flex -space-x-3">
                                <img src={doctor} alt="Doctor 1" className="w-12 sm:h-12 rounded-full border-[3px] border-white object-cover shadow-sm z-30" />
                                <img src={black} alt="Doctor 2" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-white object-cover shadow-sm z-20" />
                                <img src={white} alt="Doctor 3" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-white object-cover shadow-sm z-10" />
                            </div>
                            <div className="ml-4 bg-[#eaf1ff] text-[#0a192f] text-[10px] sm:text-[11px] font-bold px-3 py-2 rounded-full tracking-wide">
                                +5k Active Clinicians
                            </div>
                        </div>

                    </div>

                    {/* CARD 2: Smart ATS (Spans 1 column, Purple Theme) */}
                    <div className="md:col-span-1 lg:col-span-1 bg-[#4631ab] rounded-[2rem] p-8 sm:p-10 shadow-md flex flex-col justify-start h-full group transition-transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <HiOutlineTemplate className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                            Smart ATS
                        </h3>
                        <p className="text-[#c4b5fd] text-[14px] sm:text-[15px] leading-relaxed">
                            Lightweight applicant tracking designed for surgical precision. Filter by specialty,
                            years of experience, and location in one click.
                        </p>
                    </div>

                    {/* CARD 3: Compliance-First (Spans 1 column, White Theme) */}
                    <div className="md:col-span-1 lg:col-span-1 bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-start h-full group transition-transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-[#38bdf8] text-[#0a192f] rounded-xl flex items-center justify-center mb-6">
                            <MdVerifiedUser className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f] mb-4">
                            Compliance-First
                        </h3>
                        <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed">
                            Real-time alerts if a staff member's license is nearing expiration. We keep
                            your institution audit-ready 24/7.
                        </p>
                    </div>

                    {/* CARD 4: Reduced Overhead (Spans 2 columns on Desktop/Tablet, Light Blue Theme) */}
                    <div className="md:col-span-2 lg:col-span-2 bg-[#eef3fc] rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-12 h-full group transition-shadow hover:shadow-md">

                        <div className="w-full sm:w-3/5">
                            <h3 className="text-2xl sm:text-3xl font-bold text-[#0a192f] mb-4">
                                Reduced Overhead
                            </h3>
                            <p className="text-slate-600 text-[15px] leading-relaxed">
                                Save up to 40% on recruitment agency fees. By bringing initial vetting
                                in-house with our tools, your HR team does more with less.
                            </p>
                        </div>

                        {/* Inner Floating Stat Card */}
                        <div className="w-full sm:w-auto bg-white rounded-2xl shadow-sm p-6 sm:px-10 sm:py-8 flex flex-col items-center justify-center shrink-0">
                            <span className="text-4xl sm:text-5xl font-extrabold text-[#0344b5] tracking-tight">
                                -40%
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-2">
                                Admin Costs
                            </span>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default InstituteEcosystem;