import Navbar from "../../../components/website/Navbar";
import HeroCard from "../../../components/HeroCard";
import Footer from "../../../components/website/Footer";
import TrustedByComp from "../../../components/TrustedByComp";
import Vetting from "../../../components/Vetting";
import Testimonial from "../../../components/Testimonial";
import Features from "../../../components/Features";
import Comparison from "../../../components/Comparison";
import CTA from "../../../components/CTA";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
<HeroCard/>
      <TrustedByComp />
      <Vetting />
      <Features />
      <Testimonial />
      <Comparison />
      <CTA />
      
  <Footer />
    </div>
  );
}