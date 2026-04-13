import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-24 pb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600">Our privacy policy details will be updated here shortly.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
