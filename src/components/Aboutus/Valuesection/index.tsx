const ValuesSection = () => {
  const values = [
    {
      icon: "🛡️",
      title: "Integrity",
      border: "border-blue-500",
      description:
        "Radical transparency in credentials and reporting. We believe trust is the primary currency of healthcare.",
    },
    {
      icon: "🎯",
      title: "Precision",
      border: "border-blue-600",
      description:
        "Not just a match, but the right match. We use 14 unique clinical data points to pair talent with tasks.",
    },
    {
      icon: "⚡",
      title: "Efficiency",
      border: "border-indigo-600",
      description:
        "Time saved is lives saved. Our automated workflows eliminate the friction of traditional medical recruitment.",
    },
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Values of The Digital Clinician
        </h2>

        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          Our operating system is built on three foundational pillars, ensuring
          every interaction meets the highest clinical standards.
        </p>

        {/* Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
          {values.map((item, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-xl p-6 border-l-4 ${item.border}`}
            >
              <div className="text-blue-600 text-xl mb-3">
                {item.icon}
              </div>

              <h3 className="font-semibold text-lg text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 text-gray-600 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;