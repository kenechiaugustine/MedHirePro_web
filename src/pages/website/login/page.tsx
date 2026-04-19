import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { EmailInput, PasswordInput } from "../../../components/app";
import heroimage from "../../../assets/heroimage.png";
import { WEBSITE_ROUTES } from "../routes.enum";

export default function LoginPage() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">

            <main className="flex flex-1 overflow-hidden">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                    <img
                        src={heroimage}
                        alt="Doctor"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540]/95 via-[#0A3D91]/85 to-[#0EA5E9]/60"></div>

                    <div className="relative z-10 flex flex-col justify-center h-full px-16 text-white">

                        <div className="max-w-xl">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm mb-6 w-fit shadow-sm">
                                <div className="w-5 h-5 flex items-center justify-center bg-blue-600 rounded-full">
                                    <HiOutlineBadgeCheck className="w-3 h-3 text-white" />
                                </div>
                                Verified Clinical Recruitment
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-semibold leading-[1.1]">
                                <span className="text-white">
                                    Surgical <br />
                                    Precision <br />
                                </span>

                                <span className="text-sky-200">
                                    In Talent <br />
                                    Matching.
                                </span>
                            </h1>

                            <p className="mt-6 text-blue-100 text-lg leading-relaxed">
                                The trusted platform connecting healthcare professionals and institutions across Nigeria.
                            </p>

                            <div className="flex items-center mt-8 gap-4">
                                <div className="flex -space-x-3">
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=1" alt="User 1" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=2" alt="User 2" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=3" alt="User 3" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=4" alt="User 4" />
                                </div>

                                <p className="text-sm text-blue-200">
                                    Trusted by 12,000+ Professionals & Institutions
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-8 bg-[#f8fafc] overflow-y-auto">
                    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">

                        {/* Back to site — top left */}
                        <div className="mb-6">
                            <Link
                                to={WEBSITE_ROUTES.HOME}
                                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <FiArrowLeft className="text-base" />
                                Back to site
                            </Link>
                        </div>

                        {/* Welcome */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>

                        <p className="text-gray-500 mb-6 text-sm">
                            Sign in to access your MedHirePro dashboard.
                        </p>

                        {/* FORM */}
                        <form className="space-y-5">

                            <EmailInput
                                id="login-email"
                                label="EMAIL ADDRESS"
                                placeholder="you@example.com"
                            />

                            {/* PASSWORD with forgot link */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="login-password" className="text-[12px] font-bold text-[#0a192f]">
                                        PASSWORD
                                    </label>
                                    <Link
                                        to={WEBSITE_ROUTES.LOGIN}
                                        className="text-[11px] text-blue-600 hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <PasswordInput
                                    id="login-password"
                                    label=""
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* REMEMBER */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <input type="checkbox" id="remember-device" className="accent-blue-600" />
                                <label htmlFor="remember-device">Remember this device</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-700 text-white py-2.5 rounded-md hover:bg-blue-800 transition font-medium"
                            >
                                Sign In →
                            </button>
                        </form>

                        {/* DIVIDER */}
                        <div className="text-center text-[11px] text-gray-400 my-6">
                            OR CONTINUE WITH
                        </div>

                        {/* SOCIAL — Google only */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-md text-sm hover:bg-gray-50 transition-colors"
                        >
                            <FcGoogle className="text-xl" />
                            Continue with Google
                        </button>

                        {/* SIGNUP */}
                        <p className="text-sm text-gray-500 text-center mt-6">
                            New to the platform{" "}
                            <Link to={WEBSITE_ROUTES.SIGNUP} className="text-blue-600 font-medium hover:underline">
                                Sign Up
                            </Link>
                        </p>

                    </div>
                </div>

            </main>
        </div>
    );
}