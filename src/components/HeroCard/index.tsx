import { CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="px-6 pt-20 pb-20 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        <div>
          <span className="text-xs tracking-widest text-blue-600 font-semibold uppercase">
            Institutional Excellence
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Hire Verified <br /> Medical Talent <br />
            <span className="text-blue-600 italic">Clinical Precision.</span>
          </h1>

          <p className="mt-6 text-gray-600 max-w-md">
            Automated credential verification for Nigerian healthcare organizations. Reduce time-to-hire by 70% while maintaining absolute compliance.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700">
              Post a Job
            </button>
            <button className="bg-gray-200 px-5 py-3 rounded-lg hover:bg-gray-300">
              Request a Demo
            </button>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-bright from-blue-900 to-blue-500 p-6 shadow-xl">
            
            <div className="h-48 flex items-center justify-center text-white font-semibold">
              Healthcare Administration
            </div>

            <div className="bg-white rounded-xl p-4 mt-6 shadow">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" />
                <div>
                  <p className="font-semibold">Verification Engine</p>
                  <p className="text-sm text-gray-500">
                    Real-time sync with registries
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}