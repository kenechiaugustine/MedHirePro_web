import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";
import TrustedBy from "../../components/TrustedBy";

export default function HomePage() {
    return (
        <div>
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <TrustedBy />
            </main>
            <Footer />
        </div>
    );
}   