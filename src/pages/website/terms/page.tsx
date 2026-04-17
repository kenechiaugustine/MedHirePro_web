import Footer from "../../../components/website/Footer";
import Navbar from "../../../components/website/Navbar";

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                        Last Updated: May 2026
                    </p>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Terms of Service
                    </h1>

                    <div className="border-b mb-8"></div>

                    <p className="text-gray-600 mb-10">
                        These terms govern the professional relationship between MedHirePro.ng 
                        and the licensed healthcare providers within our ecosystem. Please read 
                        these terms carefully before using our platform.
                    </p>

                    {/* Section 1 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            1. User Agreement
                        </h2>

                        <div className="space-y-6 text-gray-600">
                            <div>
                                <p className="font-semibold text-gray-800">1.1 Eligibility</p>
                                <p>
                                    By accessing our platform, you confirm you are a licensed
                                    healthcare professional or authorized representative
                                    eligible to use our services.
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">1.2 Account Security</p>
                                <p>
                                    You are responsible for maintaining the confidentiality
                                    of your account credentials and all activities under your account.
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">1.3 Account Conduct</p>
                                <p>
                                    Users must ensure all information provided is accurate
                                    and comply with all applicable laws and regulations.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            2. Professional Conduct
                        </h2>

                        <p className="text-gray-600 mb-4">
                            All users of MedHirePro are expected to adhere to the highest
                            standards of medical professionalism and ethics.
                        </p>

                        <ul className="list-disc pl-6 space-y-3 text-gray-600">
                            <li>Maintain accurate and truthful professional credentials</li>
                            <li>Provide appropriate patient care and follow clinical guidelines</li>
                            <li>Respect confidentiality and institutional protocols</li>
                            <li>Comply with all healthcare regulatory requirements</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            3. Subscription Terms
                        </h2>

                        <div className="space-y-6 text-gray-600">
                            <div>
                                <p className="font-semibold text-gray-800">3.1 Billing Cycles</p>
                                <p>
                                    Subscription fees are billed in advance on a monthly
                                    or annual basis depending on your selected plan.
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">3.2 Cancellation Policy</p>
                                <p>
                                    You may cancel your subscription at any time. Access
                                    will remain active until the end of the current billing period.
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">3.3 Fee Modifications</p>
                                <p>
                                    We reserve the right to modify pricing with prior notice.
                                    Continued use of the platform constitutes acceptance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Agreement Confirmation */}
                    <div className="mb-16">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Agreement Confirmation
                        </h3>

                        <p className="text-gray-600 mb-6">
                            By continuing, you confirm that you have read and agree to these terms.
                            You also confirm that you understand this service does not replace
                            professional medical advice.
                        </p>

                        <div className="flex gap-4">
                            <button className="text-sm font-medium px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition">
                                Accept & Continue
                            </button>

                            <button className="text-sm font-medium px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition">
                                Decline & Exit
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}