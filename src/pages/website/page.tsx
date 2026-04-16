import CallToAction from "../../components/website/CallToAction";
import Features from "../../components/website/Features";
import Footer from "../../components/website/Footer";
import Hero from "../../components/website/Hero";
import HowItWorks from "../../components/website/HowItWorks";
import Navbar from "../../components/website/Navbar";
import Testimonials from "../../components/website/Testimonials";
import TrustedBy from "../../components/website/TrustedBy";


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