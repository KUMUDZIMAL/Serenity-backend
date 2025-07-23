import Features from "@/myComponents/Features";
import Assessement from "../myComponents/Assessement";
import Footer from "../myComponents/Footer";
import Hero from "../myComponents/Hero";
import Navbar from "../myComponents/Navbar";
import Accord from "../myComponents/Accord";
import FeatureCarousel from "../myComponents/FeatureCarousel";
import Addfeatures from "../myComponents/Addfeatures";

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen px-8 gap-4">
        <div className="pt-4">
          <Navbar />
        </div>
        <div className="flex-1">
          <Hero />
        </div>
        <div className="flex-none">
          <Features />
        </div>
        <div className="flex-none">
          <Assessement />
        </div>
        <div className="flex-none">
          <Addfeatures />
        </div>
        <div className="flex-none">
          <FeatureCarousel />
        </div>
        <div>
          <Accord/>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
