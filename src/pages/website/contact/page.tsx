import ContactHero from "../../../components/website/ContactHero";
import Footer from "../../../components/website/Footer";
import Headquarters from "../../../components/website/Headquarters";
import Navbar from "../../../components/website/Navbar";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                <ContactHero />
                <Headquarters />
            </main>

            <Footer />
        </div>
    );
}