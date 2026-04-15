const TrustedBySection = () => {
  const partners = [
    "HEAL-CORP",
    "NEXUS_MED",
    "APEX_HEALTH",
    "VITAL_LINK",
  ];

  return (
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
          {partners.map((name, index) => (
            <span
              key={index}
              className="hover:text-white transition duration-200"
            >
              {name}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustedBySection;