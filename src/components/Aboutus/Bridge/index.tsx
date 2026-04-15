const BridgingIntroSection = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* LEFT TEXT */}
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900 relative inline-block">
            {"Bridging the Gap"}
            <span className="block w-10 h-1 bg-blue-600 mt-2"></span>
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {`Medical staffing is broken. Institutions face chronic shortages while
        talented clinicians struggle with fragmented job markets. MedHirePro.ng
        was built to bridge this divide through surgical efficiency.`}
          </p>
        </div>

      </div>
    </section>
  );
};

export default BridgingIntroSection;