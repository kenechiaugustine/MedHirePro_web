import AboutHero from "../../../components/website/AboutHero";
import BridgingTheGap from "../../../components/website/BridgeTheGap";
import Footer from "../../../components/website/Footer";
import Leadership from "../../../components/website/Leadership";
import Navbar from "../../../components/website/Navbar";
import Values from "../../../components/website/Values";



export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                <AboutHero />
                <BridgingTheGap />
                <Values />
                <Leadership />
            </main>

            <Footer />
        </div>
    )
}