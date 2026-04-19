import { Link } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi';
import { MdWorkOutline } from 'react-icons/md';
import EmailInput from '../../../app/EmailInput';
import PasswordInput from '../../../app/PasswordInput';
import { WEBSITE_ROUTES } from '../../../../pages/website/routes.enum';
import docin from "../../../../assets/docin.png";

const SignupAsProfessional = () => {
    return (
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative z-10 w-full max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

                {/* Left Side */}
                <div className="hidden lg:flex flex-col">
                    <h1 className="text-4xl xl:text-5xl font-extrabold text-[#0a192f] leading-tight tracking-tight mb-6">
                        Step into your <span className="text-[#0b5cd5]">next clinical role.</span>
                    </h1>

                    <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-md">
                        Join Nigeria's elite network of healthcare professionals. Verification and credentialing happen once you're inside.
                    </p>

                    {/* 🔥 Premium Image Block with Face Focus */}
                    <div className="relative group rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(2,44,133,0.15)] mb-10 h-64 xl:h-80 w-full max-w-xl">

                        {/* Image */}
                        <img
                            src={docin}
                            alt="Doctor writing"
                            className="w-full h-full object-cover object-[50%_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a192f]/60 via-[#0b5cd5]/20 to-transparent"></div>

                        {/* Glow effect */}
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#0b5cd5]/20 to-[#066b77]/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>

                        {/* Floating badge */}
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md">
                            <p className="text-[11px] font-semibold text-[#0a192f] tracking-wide">
                                Verified Professionals Only
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-12 mt-2">
                        <div>
                            <div className="text-2xl font-extrabold text-[#0b5cd5]">500+</div>
                            <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                                Partner Hospitals
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-[#066b77]">12k+</div>
                            <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                                Verified Clinicians
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full max-w-md mx-auto lg:mx-0">

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#e0f4f9] text-[#00838f] text-[10px] font-bold tracking-widest uppercase mb-6">
                        <MdWorkOutline className="w-3.5 h-3.5" /> Healthcare Professional
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] mb-2">
                        Create your account
                    </h2>
                    <p className="text-slate-500 text-sm mb-6 sm:mb-8">
                        Enter your basic details to get started.
                    </p>

                    <form className="flex flex-col gap-4 sm:gap-5" onSubmit={(e) => e.preventDefault()}>

                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="prof-fullname" className="text-[12px] font-bold text-[#0a192f]">
                                Full Name
                            </label>
                            <div className="relative flex items-center">
                                <HiOutlineUser className="absolute left-3.5 text-slate-400 text-lg pointer-events-none" />
                                <input
                                    id="prof-fullname"
                                    type="text"
                                    placeholder="Dr. Olumide Adeleke"
                                    className="w-full bg-[#f4f8fc] text-[14px] text-slate-700 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0b5cd5]/20 focus:bg-white transition-all border border-transparent focus:border-[#0b5cd5]/30"
                                />
                            </div>
                        </div>

                        {/* Specialty */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="prof-specialty" className="text-[12px] font-bold text-[#0a192f]">
                                Primary Specialty
                            </label>
                            <div className="relative flex items-center">
                                <MdWorkOutline className="absolute left-3.5 text-slate-400 text-lg pointer-events-none" />
                                <select
                                    id="prof-specialty"
                                    className="w-full appearance-none bg-[#f4f8fc] text-[14px] text-slate-700 rounded-lg pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-[#0b5cd5]/20 focus:bg-white transition-all border border-transparent focus:border-[#0b5cd5]/30 cursor-pointer"
                                >
                                    <option value="" disabled>Select your specialty</option>
                                    <option value="general">General Practice</option>
                                    <option value="surgery">Surgery</option>
                                    <option value="pediatrics">Pediatrics</option>
                                </select>

                                <div className="absolute right-3.5 text-slate-400 pointer-events-none">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <EmailInput
                            id="prof-email"
                            label="Professional Email"
                            placeholder="olumide@hospital.ng"
                            focusColor="#0b5cd5"
                        />

                        <PasswordInput
                            id="prof-password"
                            label="Password"
                            focusColor="#0b5cd5"
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#033eb5] hover:bg-[#022c85] text-white font-medium py-3.5 rounded-lg mt-1 sm:mt-2 transition-colors"
                        >
                            Create Professional Account
                        </button>

                        <p className="text-center text-[11px] text-slate-400 mt-1 sm:mt-2 px-2 sm:px-4 leading-relaxed">
                            By signing up, you agree to our{' '}
                            <Link to={WEBSITE_ROUTES.TERMS} className="text-[#0b5cd5] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to={WEBSITE_ROUTES.PRIVACY} className="text-[#0b5cd5] hover:underline">
                                Privacy Policy
                            </Link>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupAsProfessional;