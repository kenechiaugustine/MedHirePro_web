import CallToAction from "../../../components/website/CallToAction";
 import FAQ from "../../../components/website/FAQ";
import Footer from "../../../components/website/Footer";
import InstitutionalTrust from "../../../components/website/InstitutionalTrust";
import Navbar from "../../../components/website/Navbar";
import ProfessionalAdvantage from "../../../components/website/ProfessionalAdvantage";
import ProfessionalHero from "../../../components/website/ProfessionalHero";
import Testimonials from "../../../components/website/Testimonials";

export default function ProfessionalPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="grow">
                <ProfessionalHero />
                <ProfessionalAdvantage />
                <InstitutionalTrust />
                <Testimonials />
                <FAQ />
                <CallToAction />
            </main>
            <Footer />
        </div>
    );
}
