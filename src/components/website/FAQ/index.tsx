import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const FAQ = () => {
    // Track which accordion item is currently open. 
    // Initializing with '0' leaves the first question open by default.
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        // If clicking the already open item, close it. Otherwise, open the new one.
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: 'How long does verification take?',
            answer: 'Our automated integration with Council databases usually verifies your license within 24-48 hours.',
        },
        {
            question: 'Is it free for healthcare professionals?',
            answer: 'MedHirePro is not entirely free for clinicians. However, it is very affordable. You can build your profile, get verified, and apply for jobs using credits. You can purchase credits as you go.',
        },
        {
            question: 'What kind of institutions use MedHirePro?',
            answer: 'We partner with a wide range of accredited healthcare providers, including top-tier private hospitals, specialized clinics, state health agencies, and federal medical centers across Nigeria.',
        },
        {
            question: 'What kind of institutions use MedHirePro?',
            answer: 'We partner with a wide range of accredited healthcare providers, including top-tier private hospitals, specialized clinics, state health agencies, and federal medical centers across Nigeria.',
        },
    ];

    return (
        <section className="bg-[#fcfdfe] py-16 sm:py-24">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight text-center mb-12 sm:mb-16">
                    Frequently Asked Questions
                </h2>

                {/* FAQ Accordion List */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="bg-[#f4f8fc] rounded-xl overflow-hidden transition-colors duration-300 hover:bg-[#eef4fa]"
                            >
                                {/* Accordion Button */}
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex justify-between items-center text-left px-6 py-5 sm:px-8 sm:py-6 focus:outline-none"
                                >
                                    <span className="text-[15px] sm:text-base font-bold text-[#0a192f] pr-4">
                                        {faq.question}
                                    </span>
                                    <HiChevronDown
                                        className={`w-5 h-5 text-[#0b5cd5] shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FAQ;