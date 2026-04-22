import { Users, BarChart3, ShieldCheck } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-3xl font-bold text-center">
          Ecosystem Designed for Scale
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Tools built for medical HR teams
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <Users className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Verified Talent Pool</h3>
            <p className="text-gray-600 mt-2">
              Access pre-vetted clinicians with full credential history.
            </p>
          </div>

          <div className="bg-purple-700 text-white p-6 rounded-2xl">
            <BarChart3 className="mb-3" />
            <h3 className="font-semibold text-lg">Smart ATS</h3>
            <p className="text-sm opacity-80 mt-2">
              Filter candidates instantly by specialty.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <ShieldCheck className="text-cyan-600 mb-3" />
            <h3 className="font-semibold text-lg">Compliance First</h3>
            <p className="text-gray-600 mt-2">
              Stay audit-ready with real-time alerts.
            </p>
          </div>

          <div className="md:col-span-2 bg-blue-50 p-6 rounded-2xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Reduced Overhead</h3>
              <p className="text-gray-600 text-sm">
                Cut recruitment costs significantly
              </p>
            </div>
            <span className="text-2xl font-bold text-blue-600">-40%</span>
          </div>

        </div>
      </div>
    </section>
  );
}