const AboutusHero = () => {
  return (
    
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
              src="https://via.placeholder.com/600x400?text=About+Image"
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
      );
    };
    
    export default AboutusHero;