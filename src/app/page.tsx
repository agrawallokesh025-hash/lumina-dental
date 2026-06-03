import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Specialists from "@/components/sections/Specialists";
import TreatmentJourney from "@/components/home/TreatmentJourney";
import TechnologyShowcase from "@/components/home/TechnologyShowcase";
import Gallery from "@/components/home/Gallery";
import ToothBackground from "@/components/home/ToothBackground";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full overflow-hidden relative">
      <ToothBackground />
      <Hero />
      <About />
      <Specialists />
      <TreatmentJourney />
      <TechnologyShowcase />
      <Gallery />
    </main>
  );
}
