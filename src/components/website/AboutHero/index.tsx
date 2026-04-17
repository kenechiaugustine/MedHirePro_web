import Abouthero from '../../../assets/AboutHero.png';  

const AboutHero = () => {
  return (
    <section className="bg-[#fcfdfe] pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT COLUMN: Text Content */}
          <div className="max-w-2xl">

            {/* Mission Badge */}
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#eaf1ff] text-[#0b5cd5] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-6 sm:mb-8">
              The Mission
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0a192f] leading-[1.1] tracking-tight mb-6">
              The Digital Clinician: <br className="hidden sm:block lg:hidden xl:block" />
              <span className="text-[#0b5cd5]">Precision Hiring</span> for <br className="hidden sm:block lg:hidden xl:block" />
              Modern Healthcare.
            </h1>

            {/* Paragraph Content */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-[540px]">
              We are rewriting the script for medical staffing. By
              combining clinical expertise with advanced algorithmic
              precision, we ensure that every healthcare institution finds
              its perfect match—instantly and ethically.
            </p>

          </div>

          {/* RIGHT COLUMN: Image & Floating Card */}
          <div className="relative w-full mt-8 lg:mt-0 lg:pl-10">

            {/* Main Image Container */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[650px] w-full z-10">
              <img
                src={Abouthero}
                alt="Digital Clinician analyzing data"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Floating Stats Card (Overlapping bottom-left) */}
            <div className="absolute -bottom-6 left-4 sm:-left-6 lg:-left-4 xl:-left-12 z-20 bg-white/95 backdrop-blur-sm border border-white/40 p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-[260px] sm:max-w-[300px]">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0b5cd5] mb-1.5">
                98.4%
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-[0.1em] uppercase">
                Placement Success Rate
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;