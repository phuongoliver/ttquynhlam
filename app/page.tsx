import { fetchAllPageData } from "@/sanity/lib/queries";
import Hero from "@/components/sections/Hero";
import StatsBoard from "@/components/sections/StatsBoard";
import SelectedWorks from "@/components/sections/SelectedWorks";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Footer from "@/components/sections/Footer";

export default async function Home() {
  const { siteContent, experiences, works, skills, stats } = await fetchAllPageData();

  return (
    <main>
      <Hero content={siteContent} stats={stats} />
      <StatsBoard stats={stats} />
      <SelectedWorks works={works} stats={stats} />
      <Experience experiences={experiences} />
      <Skills skills={skills} />
      <Footer content={siteContent} stats={stats} />
    </main>
  );
}
