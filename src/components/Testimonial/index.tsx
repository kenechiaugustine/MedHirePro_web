export default function Testimonial() { 
  return (
    <section className="bg-white py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        
        <p className="text-xl italic text-gray-700">
          “MedHirePro has fundamentally changed how we manage our staffing. We used to spend weeks verifying credentials; now it's a matter of minutes.”
        </p>

        {/* Avatar + Name + Title */}
        <div className="mt-8 flex flex-col items-center">
          
          {/* Avatar circle */}
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
            AO
          </div>

          {/* Name */}
          <p className="mt-4 font-semibold text-lg">
            Dr. Adebayo Ogunlesi
          </p>

          {/* Title */}
          <p className="text-gray-500 text-sm">
            Chief Medical Director, Premiere Hospital
          </p>

        </div>
      </div>
    </section>
  );
}