import Footer from "../../../components/website/Footer";
import Navbar from "../../../components/website/Navbar";
import { CheckCircle, XCircle, Users, BarChart3, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO */}
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

          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-blue-900 to-blue-500 p-6 shadow-xl">
              <div className="h-48 flex items-center justify-center text-white font-semibold">
                Healthcare Administration
              </div>

              <div className="bg-white rounded-xl p-4 mt-6 shadow">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" />
                  <div>
                    <p className="font-semibold">Verification Engine</p>
                    <p className="text-sm text-gray-500">Real-time sync with registries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
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

      {/* VETTING */}
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
              <p className="text-sm text-blue-600 font-semibold mb-2">Candidate Verification</p>
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

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center">Ecosystem Designed for Scale</h2>
          <p className="text-gray-500 text-center mt-2">Tools built for medical HR teams</p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
              <Users className="text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg">Verified Talent Pool</h3>
              <p className="text-gray-600 mt-2">Access pre-vetted clinicians with full credential history.</p>
            </div>

            <div className="bg-purple-700 text-white p-6 rounded-2xl">
              <BarChart3 className="mb-3" />
              <h3 className="font-semibold text-lg">Smart ATS</h3>
              <p className="text-sm opacity-80 mt-2">Filter candidates instantly by specialty.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <ShieldCheck className="text-cyan-600 mb-3" />
              <h3 className="font-semibold text-lg">Compliance First</h3>
              <p className="text-gray-600 mt-2">Stay audit-ready with real-time alerts.</p>
            </div>

            <div className="md:col-span-2 bg-blue-50 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Reduced Overhead</h3>
                <p className="text-gray-600 text-sm">Cut recruitment costs significantly</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">-40%</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xl italic text-gray-700">
            “MedHirePro has fundamentally changed how we manage our staffing.”
          </p>
          <p className="mt-4 font-semibold">Dr. Adebayo Ogunlesi</p>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Why MedHirePro?</h2>

          <div className="mt-10 grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-4">
              <p>Feature</p>
              <p>License Verification</p>
              <p>Specialty Filters</p>
              <p>Compliance</p>
              <p>Time-to-Hire</p>
            </div>

            <div className="bg-gray-200 p-6 rounded-xl space-y-4">
              <p>Manual</p>
              <p>Basic</p>
              <p>None</p>
              <p>45–60 days</p>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-xl space-y-4">
              <p>Automated</p>
              <p>Advanced</p>
              <p>24/7</p>
              <p className="font-bold">12–14 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-purple-700 to-blue-600 text-white p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-bold">Transform Your Recruitment Flow.</h2>

          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg">
              Get Started
            </button>
            <button className="border px-6 py-3 rounded-lg">
              Talk to Expert
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
