export default function TrustedByComp() {
  return (
    <section className="py-24 px-6 bg-gray-200">
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-3xl font-bold text-gray-900">
          Trusted by Nigeria's Leading Healthcare Providers
        </h2>

        <p className="text-gray-500 mt-2">
          Powering recruitment for top-tier hospitals and institutions
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            "REDEEMERS",
            "St. Nicholas",
            "Lagos State Health",
            "EKO Hospital",
            "LUTH",
          ].map((hospital) => (
            <span
              key={hospital}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-full text-sm font-semibold shadow-sm hover:bg-gray-200 transition"
            >
              {hospital}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}