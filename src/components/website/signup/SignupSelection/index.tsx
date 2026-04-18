import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { MdWork, MdDomain } from 'react-icons/md';

const SignupSelection = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-20 relative z-10 w-full max-w-5xl mx-auto">

            {/* Header Text */}
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-[40px] font-extrabold text-[#0a192f] tracking-tight mb-4">
                    Join the Future of Healthcare <br className="hidden sm:block" /> Recruitment
                </h1>
                <p className="text-slate-500 text-[15px] sm:text-base">
                    Select your professional identity to begin.
                </p>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">

                {/* Professional Card */}
                <Link
                    to="?as=professional"
                    className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group flex flex-col"
                >
                    <div className="w-12 h-12 bg-[#eaf1ff] rounded-xl flex items-center justify-center mb-6 text-[#0b5cd5]">
                        <MdWork className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0a192f] mb-3">I am a Healthcare Professional</h3>
                    <p className="text-slate-500 text-[14px] leading-relaxed mb-8 flex-grow">
                        Find prestigious roles in top-tier institutions. Manage your clinical career with surgical precision and surgical-grade data privacy.
                    </p>
                    <span className="text-[#0b5cd5] font-bold text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all">
                        Create Professional Profile &gt;
                    </span>
                </Link>

                {/* Institution Card */}
                <Link
                    to="?as=institute"
                    className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group flex flex-col"
                >
                    <div className="w-12 h-12 bg-[#edeafe] rounded-xl flex items-center justify-center mb-6 text-[#4631ab]">
                        <MdDomain className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0a192f] mb-3">I am a Healthcare Institution</h3>
                    <p className="text-slate-500 text-[14px] leading-relaxed mb-8 flex-grow">
                        Access a verified pipeline of specialist talent. Streamline hospital staffing with intelligent matching and institutional-grade analytics.
                    </p>
                    <span className="text-[#4631ab] font-bold text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all">
                        Register Institution &gt;
                    </span>
                </Link>

            </div>

            {/* Back to Home */}
            <Link to="/" className="mt-12 flex items-center gap-2 text-slate-500 hover:text-[#0a192f] font-medium transition-colors text-sm">
                <HiArrowLeft /> Back to Home
            </Link>

        </div>
    );
};

export default SignupSelection;