import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const AboutUs = () => {
  return (
     <>
      <Navbar />
    
    <section className="bg-gray-50 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <span className="text-xs font-semibold tracking-wide text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            THE MISSION
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            The Digital Clinician:{" "}
            <span className="text-blue-600">
              Precision Hiring
            </span>{" "}
            for Modern Healthcare.
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            We are rewriting the script for medical staffing. By combining
            clinical expertise with advanced algorithmic precision, we ensure
            that every healthcare institution finds its perfect match—instantly
            and ethically.
          </p>
        </div>

        {/* RIGHT IMAGE CARD */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/about-image.jpg" // replace with your image path
              alt="Digital Healthcare"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay Card */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-5 py-3">
            <p className="text-xl font-bold text-blue-600">98.4%</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Placement Success Rate
            </p>
          </div>
        </div>

      </div>
    </section>


    {/* BRIDGING THE GAP SECTION */}
<section className="bg-gray-100 py-16 px-6 md:px-16">
  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-start">
    
    {/* LEFT TEXT */}
    <div>
      <h2 className="text-2xl font-bold text-gray-900 relative inline-block">
        Bridging the Gap
        <span className="block w-10 h-1 bg-blue-600 mt-2"></span>
      </h2>

      <p className="mt-4 text-gray-600 leading-relaxed">
        Medical staffing is broken. Institutions face chronic shortages while
        talented clinicians struggle with fragmented job markets. MedHirePro.ng
        was built to bridge this divide through surgical efficiency.
      </p>
    </div>

    {/* CARD 1 */}
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="text-blue-600 text-2xl mb-4">✚</div>
      <h3 className="font-semibold text-lg text-gray-900">
        For Institutions
      </h3>
      <p className="mt-2 text-gray-600 text-sm">
        Access a pre-vetted network of specialists ready to deploy within 48
        hours, reducing vacancy times by 65%.
      </p>
    </div>

    {/* CARD 2 */}
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="text-blue-600 text-2xl mb-4">🩺</div>
      <h3 className="font-semibold text-lg text-gray-900">
        For Clinicians
      </h3>
      <p className="mt-2 text-gray-600 text-sm">
        Your expertise deserves premium placement. We match your specific
        sub-specialties with high-impact opportunities.
      </p>
    </div>

  </div>
</section>


{/* VALUES SECTION */}
<section className="bg-white py-16 px-6 md:px-16">
  <div className="max-w-7xl mx-auto text-center">
    
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      Values of The Digital Clinician
    </h2>

    <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
      Our operating system is built on three foundational pillars, ensuring
      every interaction meets the highest clinical standards.
    </p>

    {/* VALUE CARDS */}
    <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
      
      {/* Integrity */}
      <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
        <div className="text-blue-600 text-xl mb-3">🛡️</div>
        <h3 className="font-semibold text-lg text-gray-900">
          Integrity
        </h3>
        <p className="mt-2 text-gray-600 text-sm">
          Radical transparency in credentials and reporting. We believe trust is
          the primary currency of healthcare.
        </p>
      </div>

      {/* Precision */}
      <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
        <div className="text-blue-600 text-xl mb-3">🎯</div>
        <h3 className="font-semibold text-lg text-gray-900">
          Precision
        </h3>
        <p className="mt-2 text-gray-600 text-sm">
          Not just a match, but the right match. We use 14 unique clinical data
          points to pair talent with tasks.
        </p>
      </div>

      {/* Efficiency */}
      <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-indigo-600">
        <div className="text-blue-600 text-xl mb-3">⚡</div>
        <h3 className="font-semibold text-lg text-gray-900">
          Efficiency
        </h3>
        <p className="mt-2 text-gray-600 text-sm">
          Time saved is lives saved. Our automated workflows eliminate the
          friction of traditional medical recruitment.
        </p>
      </div>

    </div>
  </div>
</section>



{/* LEADERSHIP SECTION */}
<section className="bg-gray-50 py-16 px-6 md:px-16">
  <div className="max-w-7xl mx-auto">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
      <div>
        <p className="text-xs text-blue-600 font-semibold tracking-wide uppercase">
          Leadership
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
          Architects of the Future
        </h2>
      </div>

      <p className="text-gray-500 mt-4 md:mt-0 max-w-md">
        Combining 50+ years of healthcare logistics and software engineering.
      </p>
    </div>

    {/* GRID */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* LEFT PROFILE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img
          src="/team1.jpg" // replace with your image
          alt="Dr Marcus Chen"
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <p className="text-xs text-blue-600 font-semibold uppercase">
            Founder & CEO
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-1">
            Dr. Marcus Chen
          </h3>
          <p className="text-gray-600 text-sm mt-3">
            “Our mission is to ensure no hospital operates below its highest
            potential.”
          </p>
        </div>
      </div>

      {/* RIGHT PROFILE (TALL CARD) */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden md:col-span-2">
        <img
          src="/team2.jpg" // replace with your image
          alt="Sarah Olaitan"
          className="w-full h-80 object-cover"
        />
        <div className="p-6">
          <p className="text-xs text-blue-600 font-semibold uppercase">
            Chief Product Officer
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-1">
            Sarah Olaitan
          </h3>
        </div>
      </div>

      {/* SMALL PROFILE */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
        <img
          src="/team3.jpg"
          alt="Dr James Kalu"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="text-xs text-blue-600 font-semibold uppercase">
            Medical Advisor
          </p>
          <h4 className="text-sm font-bold text-gray-900">
            Dr. James Kalu
          </h4>
        </div>
      </div>

      {/* ADVISORY CTA */}
      <div className="bg-blue-50 rounded-2xl p-6 md:col-span-2 flex flex-col justify-center">
        <h3 className="text-lg font-bold text-gray-900">
          Join our Board of Advisors
        </h3>
        <p className="text-gray-600 text-sm mt-2 max-w-md">
          We are always looking for visionary clinical leaders and technology
          pioneers to help shape the next decade of healthcare staffing.
        </p>
        <button className="mt-4 text-blue-600 font-semibold text-sm">
          View Open Opportunities →
        </button>
      </div>

    </div>
  </div>
</section>

<section className="w-full px-4 py-12 flex justify-center">
  <div className="w-full max-w-6xl bg-gradient-to-r from-[#0a1f3c] to-[#0d2a4f] text-white rounded-xl px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
    
    {/* Left Side */}
    <div className="max-w-md">
      <h3 className="text-lg md:text-xl font-semibold mb-2">
        Trusted by the Community
      </h3>
      <p className="text-sm text-slate-300 leading-relaxed">
        The primary partner for over 200+ leading medical institutions and
        1000+ certified healthcare professionals.
      </p>
    </div>

    {/* Right Side */}
    <div className="flex flex-wrap gap-6 md:gap-10 text-sm font-medium tracking-wide text-slate-200">
      <span className="hover:text-white transition duration-200">HEAL-CORP</span>
      <span className="hover:text-white transition duration-200">NEXUS_MED</span>
      <span className="hover:text-white transition duration-200">APEX_HEALTH</span>
      <span className="hover:text-white transition duration-200">VITAL_LINK</span>
    </div>

  </div>
</section>


        <Footer />
        </>
  );
};

export default AboutUs;