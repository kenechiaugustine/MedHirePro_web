import { Link } from 'react-router-dom';
import { WEBSITE_ROUTES } from '../../../pages/website/routes.enum';

const CallToAction = () => {
    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Large Blue Card Container */}
                <div className="bg-[#094298] bg-gradient-to-br from-[#0a46a1] to-[#052b69] rounded-[2rem] px-6 py-14 sm:py-20 text-center shadow-xl shadow-blue-900/10 relative overflow-hidden">

                    {/* Subtle Background Glow/Overlay (Optional but adds depth) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white tracking-tight mb-5 leading-tight">
                            Ready to Elevate Your Career?
                        </h2>

                        {/* Subheading */}
                        <p className="text-blue-100 text-[15px] sm:text-lg mb-10 leading-relaxed max-w-xl mx-auto font-medium">
                            Join the largest network of verified medical professionals in Nigeria today.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
                            <Link
                                to={WEBSITE_ROUTES.SIGNUP}
                                className="w-full sm:w-auto bg-white text-[#094298] font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Create Free Account
                            </Link>

                            <Link
                                to={WEBSITE_ROUTES.CONTACT}
                                className="w-full sm:w-auto bg-[#135ad1] hover:bg-[#114eb5] text-white font-bold px-8 py-3.5 rounded-xl border border-blue-400/30 transition-colors shadow-sm"
                            >
                                Schedule a Demo
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CallToAction;