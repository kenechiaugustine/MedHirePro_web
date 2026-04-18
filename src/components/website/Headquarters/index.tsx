import { FaDirections } from 'react-icons/fa';

const Headquarters = () => {
    // Replace with your actual Google Maps URL
    const googleMapsUrl = "https://www.google.com/maps/place/Victoria+Island,+Lagos/";

    return (
        <section className="bg-[#fcfdfe] py-10 sm:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Background Image Container */}
                <div
                    className="relative w-full h-[400px] sm:h-[450px] rounded-[2rem] overflow-hidden flex items-end sm:items-center p-8 sm:p-12 shadow-xl"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000')", // Replace with your image
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >

                    {/* White Card */}
                    <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl w-full sm:max-w-md shadow-2xl border border-white/50">
                        <h3 className="text-2xl font-bold text-[#0a192f] mb-3">Our Headquarters</h3>
                        <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
                            Located in the heart of Victoria Island, facilitating healthcare excellence across the country.
                        </p>

                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[#0b5cd5] font-bold text-[15px] hover:text-[#094bb3] transition-colors"
                        >
                            <FaDirections className="text-lg" />
                            Get Directions
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Headquarters;