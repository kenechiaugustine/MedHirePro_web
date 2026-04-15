const InfoCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="text-blue-600 text-2xl mb-4">✚</div>

      <h3 className="font-semibold text-lg text-gray-900">
        For Institutions
      </h3>

      <p className="mt-2 text-gray-600 text-sm">
        Access a pre-vetted network of specialists ready to deploy within 48
        hours, reducing vacancy times by 65%.
      </p>

      <div className="mt-6 text-blue-600 text-2xl mb-4">🩺</div>

      <h3 className="font-semibold text-lg text-gray-900">
        For Clinicians
      </h3>

      <p className="mt-2 text-gray-600 text-sm">
        Your expertise deserves premium placement. We match your specific
        sub-specialties with high-impact opportunities.
      </p>

    </div>
  );
};

export default InfoCard;