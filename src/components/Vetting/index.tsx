import { CheckCircle, XCircle } from "lucide-react";

export default function Vetting() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        <div>
          <h2 className="text-3xl font-bold">
            Stop Wasting Months on <span className="text-blue-600">Manual Vetting.</span>
          </h2>

          <p className="mt-4 text-gray-600">
            Traditional recruitment involves weeks of back-and-forth verification and risk.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex gap-3 items-center">
              <XCircle className="text-red-500" />
              <span>Manual verification (60+ days)</span>
            </div>
            <div className="flex gap-3 items-center">
              <CheckCircle className="text-green-500" />
              <span>Instant API verification</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto">
            <p className="text-sm text-blue-600 font-semibold mb-2">
              Candidate Verification
            </p>
            <p className="font-semibold">Dr. Chidi Okoro</p>
            <p className="text-sm text-gray-500">Consultant Surgeon</p>
          </div>

          <div className="absolute bottom-0 right-0 translate-x-6 translate-y-6 bg-purple-600 text-white p-4 rounded-xl shadow">
            <p className="text-xl font-bold">4.2s</p>
            <p className="text-xs">Verification Time</p>
          </div>
        </div>

      </div>
    </section>
  );
}