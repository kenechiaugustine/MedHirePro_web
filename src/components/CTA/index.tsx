export default function CTA() {
  return (
    <section className="px-6 py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        
        <div className="relative rounded-[28px] px-10 py-16 text-center text-white overflow-hidden
                        bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800">
          
          {/* Glow overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,white,transparent_40%)]"></div>

          {/* Light streak */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(120deg,transparent,white,transparent)]"></div>

          {/* Content */}
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
            Transform Your <br /> Recruitment Flow.
          </h2>

          <p className="mt-4 text-sm md:text-base text-indigo-100 max-w-xl mx-auto">
            Join Nigeria’s leading healthcare network and start hiring verified talent today.
            No setup fees, no complicated contracts.
          </p>

          {/* Links */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            
            <a
              href="/get-started"
              className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-xl shadow-sm hover:bg-gray-100 transition inline-block"
            >
              Get Started for Free
            </a>

            <a
              href="/contact"
              className="border border-white/60 text-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-700 transition inline-block"
            >
              Talk to an Expert
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}