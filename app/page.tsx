import Hero from "@/components/sections/Hero";
import StatsBoard from "@/components/sections/StatsBoard";
import SelectedWorks from "@/components/sections/SelectedWorks";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBoard />
      <SelectedWorks />
      <Experience />
      <Skills />
      <Footer />
    </main>
  );
}
