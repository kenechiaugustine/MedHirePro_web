import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";
import TrustedBy from "../../components/TrustedBy";
import Features from "../../components/Features";
import HowItWorks from "../../components/HowItWorks";
import Testimonials from "../../components/Testimonials";
import CallToAction from "../../components/CallToAction";

export default function HomePage() {
    return (
        <div>
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <TrustedBy />
                <Features />
                <HowItWorks />
                <Testimonials />
                <CallToAction />
            </main>
            <Footer />
        </div>
    );
}   