import { MdEmail, MdLocationOn } from 'react-icons/md';

const ContactHero = () => {
    return (
        <section className="bg-[#fcfdfe] py-16 lg:py-24 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* LEFT COLUMN: Text Content & Info Cards */}
                    <div className="flex flex-col">

                        {/* Badge */}
                        <div className="inline-flex self-start px-3.5 py-1.5 rounded-full bg-[#e0f4f9] text-[#00838f] text-[11px] font-bold tracking-wider uppercase mb-6 sm:mb-8">
                            Contact Support
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0a192f] leading-[1.1] tracking-tight mb-6">
                            Get in Touch with our Support Team
                        </h1>

                        {/* Description */}
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-[500px] mb-12">
                            Precision healthcare staffing starts with exceptional communication. Whether you're a clinician or an institution, we're here to facilitate your next step.
                        </p>

                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">

                            {/* Email Card */}
                            <div className="bg-[#f4f7fb] rounded-2xl p-6 flex flex-col items-start border border-gray-100">
                                <div className="w-10 h-10 bg-[#eaf1ff] text-[#0b5cd5] rounded-xl flex items-center justify-center mb-4">
                                    <MdEmail className="w-5 h-5" />
                                </div>
                                <h4 className="text-[15px] font-bold text-[#0a192f] mb-2">Email Us</h4>
                                <p className="text-sm text-slate-500">support@medhirepro.ng</p>
                            </div>

                            {/* Location Card */}
                            <div className="bg-[#f4f7fb] rounded-2xl p-6 flex flex-col items-start border border-gray-100">
                                <div className="w-10 h-10 bg-[#e0f4f9] text-[#00838f] rounded-xl flex items-center justify-center mb-4">
                                    <MdLocationOn className="w-5 h-5" />
                                </div>
                                <h4 className="text-[15px] font-bold text-[#0a192f] mb-2">Visit Lagos</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    15 Victoria Island, Lagos State, Nigeria
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: Contact Form Card */}
                    <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 lg:mt-4">
                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

                            {/* Top Row: Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="fullName" className="text-[13px] font-bold text-[#0a192f]">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        placeholder="John Doe"
                                        className="bg-[#f4f7fb] text-slate-700 text-[15px] px-4 py-3 outline-none border-b-2 border-gray-200 focus:border-[#0b5cd5] focus:bg-[#f0f4f8] transition-colors rounded-t-md"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-[13px] font-bold text-[#0a192f]">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john@hospital.com"
                                        className="bg-[#f4f7fb] text-slate-700 text-[15px] px-4 py-3 outline-none border-b-2 border-gray-200 focus:border-[#0b5cd5] focus:bg-[#f0f4f8] transition-colors rounded-t-md"
                                    />
                                </div>
                            </div>

                            {/* Subject Select */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="subject" className="text-[13px] font-bold text-[#0a192f]">Subject</label>
                                <div className="relative">
                                    <select
                                        id="subject"
                                        className="w-full appearance-none bg-[#f4f7fb] text-slate-700 text-[15px] px-4 py-3 outline-none border-b-2 border-gray-200 focus:border-[#0b5cd5] focus:bg-[#f0f4f8] transition-colors rounded-t-md cursor-pointer"
                                    >
                                        <option value="Professional Verification">Professional Verification</option>
                                        <option value="Institution Partnership">Institution Partnership</option>
                                        <option value="Technical Support">Technical Support</option>
                                        <option value="Advisory Services">Advisory Services</option>
                                        <option value="Billing Enquiry">Billing Enquiry</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {/* Custom dropdown arrow */}
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                        <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Message Textarea */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-[13px] font-bold text-[#0a192f]">Your Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    placeholder="How can we assist you today?"
                                    className="bg-[#f4f7fb] text-slate-700 text-[15px] px-4 py-3 outline-none border-b-2 border-gray-200 focus:border-[#0b5cd5] focus:bg-[#f0f4f8] transition-colors rounded-t-md resize-y"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="mt-4 w-full bg-[#0b5cd5] hover:bg-[#094bb3] text-white font-medium py-3.5 rounded-lg transition-colors shadow-md shadow-blue-500/20"
                            >
                                Send Message
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactHero;