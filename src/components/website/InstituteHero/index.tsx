import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';
import { MdInsertChartOutlined } from 'react-icons/md';
import { WEBSITE_ROUTES } from '../../../pages/website/routes.enum';

const InstituteHero = () => {
  return (
    <section className="bg-[#fcfdfe] py-12 lg:py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT COLUMN: Text Content */}
          <div className="max-w-2xl">

            {/* Excellence Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eaf1ff] text-[#0b5cd5] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-6 sm:mb-8">
              <HiShieldCheck className="w-4 h-4" />
              Institutional Excellence
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#0a192f] leading-[1.1] tracking-tight mb-6">
              Hire Verified <br className="hidden sm:block" />
              Medical Talent <br className="hidden lg:block" />
              with <span className="text-[#0b5cd5]">Clinical</span> <br className="hidden sm:block" />
              <span className="text-[#0b5cd5]">Precision.</span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-[500px] mb-10">
              Automated credential verification for Nigerian healthcare
              organizations. Reduce time-to-hire by 70% while maintaining
              absolute compliance with MDCN, NMCN, and PCN standards.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <Link
                to={`${WEBSITE_ROUTES.SIGNUP}?as=institute`}
                className="bg-[#0b5cd5] hover:bg-[#094bb3] text-white px-8 py-3.5 rounded-lg font-medium text-[15px] text-center transition-colors duration-200 shadow-md shadow-blue-500/20"
              >
                Post a Job
              </Link>

              <Link
                to={WEBSITE_ROUTES.CONTACT}
                className="bg-[#eaf1ff] hover:bg-[#dbe6fe] text-[#0b5cd5] px-8 py-3.5 rounded-lg font-medium text-[15px] text-center transition-colors duration-200"
              >
                Request a Demo
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Image & Floating Card */}
          <div className="relative w-full mt-8 lg:mt-0 lg:pl-8">

            {/* Main Image Container */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[600px] w-full z-10 bg-[#1a365d]">
              <img
                // Placeholder image with text
                src="https://placehold.co/800x600/1a365d/ffffff?text=HEALTHCARE\nADMINISTRATION"
                alt="Healthcare Administration"
                className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay"
              />
              {/* Fallback gradient if image fails to load/blend */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] to-[#0f172a] -z-10"></div>

              {/* Floating Verification Card (Spans bottom width) */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 bg-white/95 backdrop-blur-sm border border-white/40 p-4 sm:p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-4">

                {/* Teal Icon Box */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#066b77] flex items-center justify-center shrink-0 shadow-sm">
                  <MdInsertChartOutlined className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                {/* Text Info */}
                <div>
                  <div className="text-[13px] sm:text-[14px] font-bold text-[#0a192f] leading-tight">
                    Verification Engine
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5">
                    Real-time sync with national registries
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InstituteHero;