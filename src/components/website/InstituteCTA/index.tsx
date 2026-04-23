import { Link } from 'react-router-dom';
import { WEBSITE_ROUTES } from '../../../pages/website/routes.enum';

const InstituteCTA = () => {
    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Purple Card Container */}
                <div className="relative bg-[#4631ab] rounded-[2.5rem] px-6 py-16 sm:py-20 text-center shadow-2xl overflow-hidden">

                    {/* Decorative Background Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
              `,
                            backgroundSize: '40px 40px'
                        }}
                    ></div>

                    {/* Faint Glowing Orbs for Depth/Wave effect */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-indigo-500/30 blur-[100px] rounded-full mix-blend-screen"></div>
                        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[150%] bg-purple-500/30 blur-[100px] rounded-full mix-blend-screen"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]">
                            Transform Your <br className="hidden sm:block" /> Recruitment Flow.
                        </h2>

                        {/* Subheading */}
                        <p className="text-indigo-100/90 text-[15px] sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                            Join Nigeria's leading healthcare network and start hiring verified talent today. <br className="hidden sm:block" />
                            No setup fees, no complicated contracts.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
                            <Link
                                to={`${WEBSITE_ROUTES.SIGNUP}?as=institute`}
                                className="w-full sm:w-auto bg-white text-[#4631ab] font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Get Started for Free
                            </Link>

                            <Link
                                to={WEBSITE_ROUTES.CONTACT}
                                className="w-full sm:w-auto bg-transparent border border-white/80 hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
                            >
                                Talk to an Expert
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InstituteCTA;