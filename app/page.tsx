import CallToAction from "@/components/call-to-action";
import Faq from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Workflow from "@/components/workflow";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Features />
      <Workflow />
      <CallToAction />
      <Faq />
      <Footer />
    </main>
  );
}
