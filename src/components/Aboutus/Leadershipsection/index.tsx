const LeadershipSection = () => {
  return (
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
          <ProfileCard
            image="https://via.placeholder.com/300x200?text=Dr.+Marcus+Chen"
            role="Founder & CEO"
            name="Dr. Marcus Chen"
            quote="Our mission is to ensure no hospital operates below its highest potential."
            type="large"
          />

          {/* RIGHT PROFILE (TALL CARD) */}
          <ProfileCard
            image="https://via.placeholder.com/300x200?text=Sarah+Olaitan"
            role="Chief Product Officer"
            name="Sarah Olaitan"
            type="tall" quote={undefined}          />

          {/* SMALL PROFILE */}
          <ProfileMini
            image="https://via.placeholder.com/100x100?text=Dr.+James+Kalu"
            role="Medical Advisor"
            name="Dr. James Kalu"
          />

          {/* ADVISORY CTA */}
          <AdvisoryCard />

        </div>
      </div>
    </section>




  );
};


interface ProfileCardProps {
  image: string;
  role: string;
  name: string;
  quote?: string;
  type: "large" | "tall";               
}

const ProfileCard = ({ image, role, name, quote, type }: ProfileCardProps) => {
  const isTall = type === "tall";

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden ${isTall ? "md:col-span-2" : ""}`}>
      <img
        src={image}  
        alt={name}
        className={`w-full object-cover ${isTall ? "h-80" : "h-64"}`}
      />

      <div className="p-6">
        <p className="text-xs text-blue-600 font-semibold uppercase">
          {role}
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-1">
          {name}
        </h3>

        {quote && (
          <p className="text-gray-600 text-sm mt-3">
            “{quote}”
          </p>
        )}
      </div>
    </div>
  );
};




interface ProfileMiniProps {
  image: string;
  role: string;
  name: string;
}

const ProfileMini = ({  }: ProfileMiniProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
      <img
        src={"https://via.placeholder.com/100x100?text=Dr.+James+Kalu"}     
        alt={"Dr. James Kalu"}                                         
            
        className="w-14 h-14 rounded-full object-cover"
      />

      <div>
        <p className="text-xs text-blue-600 font-semibold uppercase">
          {"Medical Advisor"}
        </p>
        <h4 className="text-sm font-bold text-gray-900">
          {"Dr. James Kalu"}
        </h4>
      </div>
    </div>
  );
};


const AdvisoryCard = () => {
  return (
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
  );
};
export default LeadershipSection;