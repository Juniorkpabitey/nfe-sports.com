import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import PredictionPreview from "./PredictionPreview";
import CTAsection from "./CTAsection";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <div className="bg-dark text-white font-sans">
      <Hero />
      <HowItWorks />
      <Features />
      <PredictionPreview />
      <CTAsection />
      <Footer />
    </div>
  );
};

export default LandingPage;