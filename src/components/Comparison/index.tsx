export default function Comparison() {
  return (
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
  );
}