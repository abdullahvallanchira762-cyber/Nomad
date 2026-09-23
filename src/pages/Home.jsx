import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import Philosophy from "../components/home/Philosophy";
import FeaturedExpeditions from "../components/home/FeaturedExpeditions";
import JourneyBanner from "../components/home/JourneyBanner";
import ContactSection from "../components/home/ContactSection";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Philosophy />
      <FeaturedExpeditions />
      <JourneyBanner />
      <ContactSection />
    </>
  );
}

export default Home;