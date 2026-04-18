import Footer from "../../../components/website/Footer";
import Navbar from "../../../components/website/Navbar";
import heroimage from "../../../assets/heroimage.png";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-24">
                <div className="flex min-h-[calc(100vh-6rem)]">

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
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 18l-6-3V6l6-3 6 3v9l-6 3z" />
                                        </svg>
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
                                    Join the most secure ecosystem for healthcare professionals and institutions across Nigeria.
                                </p>

                                <div className="flex items-center mt-8 gap-4">
                                    <div className="flex -space-x-3">
                                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=1" />
                                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=2" />
                                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=3" />
                                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=4" />
                                    </div>

                                    <p className="text-sm text-blue-200">
                                        Trusted by 12,000+ Specialists
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-[#f8fafc]">
                        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">

                            {/* TOP */}
                            <div className="flex justify-between items-center mb-8">

                                {/* ✅ UPDATED BRAND LINK (DARK BLUE + CLICKABLE) */}
                                <a
                                    href="/"
                                    className="font-semibold text-blue-900 hover:text-blue-800 transition"
                                >
                                    MedHirePro
                                </a>

                                <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
                                    Back to site →
                                </a>
                            </div>

                            {/* Welcome */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Welcome Back
                            </h3>

                            <p className="text-gray-500 mb-6 text-sm">
                                Access your professional recruitment dashboard.
                            </p>

                            {/* FORM */}
                            <form className="space-y-5">

                                {/* EMAIL */}
                                <div>
                                    <label className="text-[11px] text-gray-500 block mb-1">
                                        PROFESSIONAL EMAIL
                                    </label>

                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 
                                                0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/>
                                            </svg>
                                        </span>

                                        <input
                                            type="email"
                                            placeholder="dr.smith@hospital.ng"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                                        <span>PASSWORD</span>
                                        <a href="#" className="text-blue-600 hover:underline">
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 1a5 5 0 00-5 5v4H6a2 2 0 00-2 2v9a2 2 
                                                0 002 2h12a2 2 0 002-2v-9a2 2 0-2-2h-1V6a5 5 
                                                0 00-5-5zm-3 9V6a3 3 0 016 0v4H9z"/>
                                            </svg>
                                        </span>

                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* REMEMBER */}
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <input type="checkbox" className="accent-blue-600" />
                                    <span>Remember this device</span>
                                </div>

                                <button className="w-full bg-blue-700 text-white py-2.5 rounded-md hover:bg-blue-800 transition font-medium">
                                    Sign In →
                                </button>
                            </form>

                            {/* DIVIDER */}
                            <div className="text-center text-[11px] text-gray-400 my-6">
                                OR CONTINUE WITH
                            </div>

                            {/* SOCIAL */}
                            <div className="flex gap-3">

                                {/* GOOGLE */}
                                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-md text-sm hover:bg-gray-100">

                                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.5 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.13 17.74 9.5 24 9.5z"/>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.6-.15-3.13-.43-4.55H24v9.09h12.94c-.56 3-2.26 5.53-4.8 7.24l7.36 5.73C43.94 37.2 46.98 31.45 46.98 24.55z"/>
                                        <path fill="#FBBC05" d="M10.54 28.41A14.5 14.5 0 019.5 24c0-1.52.26-2.99.72-4.41l-7.98-6.19A24 24 0 000 24c0 3.9.94 7.58 2.56 10.78l7.98-6.37z"/>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.36-5.73c-2.04 1.37-4.64 2.18-8.55 2.18-6.26 0-11.57-3.63-13.46-8.87l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                    </svg>

                                    Google
                                </button>

                                {/* INSTITUTIONAL */}
                                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-md text-sm hover:bg-gray-100">

                                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 21V3h18v18H3zm2-2h14V5H5v14zm2-2h2v2H7v-2zm0-4h2v2H7v-2zm0-4h2v2H7V9zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V9zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V9z"/>
                                    </svg>

                                    Institutional
                                </button>

                            </div>

                            {/* SIGNUP */}
                            <p className="text-sm text-gray-500 text-center mt-6">
                                New to the platform{" "}
                                <a href="#" className="text-blue-600 font-medium">
                                    Sign Up
                                </a>
                            </p>

                            {/* FOOTER */}
                            <p className="text-[10px] text-gray-400 text-center mt-8">
                                © 2026 MedHirePro.ng · Privacy Policy · Professional Standards
                            </p>

                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}