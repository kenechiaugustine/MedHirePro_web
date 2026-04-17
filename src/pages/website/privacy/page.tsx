import Footer from "../../../components/website/Footer";
import Navbar from "../../../components/website/Navbar";
import { Link } from "react-router-dom";
import { WEBSITE_ROUTES } from "../routes.enum";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                        Effective May 2026
                    </p>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Privacy Policy
                    </h1>

                    <p className="text-gray-600 mb-10">
                        This document outlines our standards for handling clinical credentials,
                        personal data, and institutional records within the MedHirePro ecosystem.
                    </p>

                    {/* Highlight */}
                    <div className="border-l-4 border-blue-500 bg-white p-6 mb-10 shadow-sm">
                        <p className="text-gray-700 italic">
                            At MedHirePro, we believe medical data is a sacred trust.
                            This policy outlines our commitment to transparency, security,
                            and the sovereign rights of clinicians and healthcare institutions.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Data Collection
                        </h2>

                        <p className="text-gray-600 mb-6">
                            We collect information when you register as a clinician,
                            apply for hospital placements, or engage with our
                            institutional matching algorithms.
                         </p>

                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                1.1 Identity Data
                            </h3>
                            <p className="text-gray-600">
                                Full legal name, professional license numbers (NMC, MDCN,MLSCN etc.), contact information, and
                                verified government identification.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                1.2 Clinical Metrics
                            </h3>
                            <p className="text-gray-600">
                                Practice history, specialty certifications, surgical logs,
                                and performance indicators.
                            </p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Medical Data Security
                        </h2>

                        <p className="text-gray-600">
                            Our Zero-Trust architecture ensures that clinician credentials
                            and hospital operational data are encrypted both in transit
                            and at rest using AES-256 standards.
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            3. User Rights
                        </h2>

                        <div className="space-y-6 text-gray-600">
                            <div>
                                <p className="font-semibold text-gray-800">Right to Access:</p>
                                <p>Request a complete export of your personal and clinical data.</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">Right to Rectify:</p>
                                <p>Update or correct inaccurate credentialing information.</p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">Right to Erasure:</p>
                                <p>Delete your account and associated data (subject to regulations).</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            4. Global Compliance
                        </h2>

                        <p className="text-gray-600">
                            Our framework aligns with GDPR and HIPAA standards, with regular
                            audits to ensure data protection according to international best practices.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="bg-white border rounded-xl p-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Contact Our Data Protection Officer
                        </h3>

                        <p className="text-gray-600 mb-6">
                            For privacy concerns or institutional audits, contact our legal team.
                        </p>

                        <Link
                            to={WEBSITE_ROUTES.CONTACT}
                            className="inline-block px-6 py-3 border rounded-lg hover:bg-gray-100 transition text-gray-700"
                        >
                            Contact Support
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}