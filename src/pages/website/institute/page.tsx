import Footer from "../../../components/website/Footer";
import InstituteCTA from "../../../components/website/InstituteCTA";
import InstituteEcosystem from "../../../components/website/InstituteEcosystem";
import InstituteHero from "../../../components/website/InstituteHero";
import InstituteVetting from "../../../components/website/InstituteVetting";
import Navbar from "../../../components/website/Navbar";
import Testimonials from "../../../components/website/Testimonials";
import TrustedBy from "../../../components/website/TrustedBy";
import WhyMedHirePro from "../../../components/website/WhyMedHirePro";

export default function InstitutePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <InstituteHero />
        <TrustedBy />
        <InstituteVetting />
        <InstituteEcosystem />
        <Testimonials />
        <WhyMedHirePro />
        <InstituteCTA />
      </main>
      <Footer />
    </div>
  );
};
