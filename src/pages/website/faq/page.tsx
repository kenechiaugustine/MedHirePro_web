import Footer from "../../../components/website/Footer";
import Navbar from "../../../components/website/Navbar";

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-24 pb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-gray-600">Answers to common questions will be listed here.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
