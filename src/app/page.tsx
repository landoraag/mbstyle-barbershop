import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Barbers } from "@/components/home/barbers";
import { Contact, FinalCta, Footer, HowItWorks, Space } from "@/components/home/rest";
import { Loader } from "@/components/loader";
import { Cursor, SmoothScroll, VelocityMarquee } from "@/components/fx";
import { Manifesto } from "@/components/home/manifesto";
import { Nav } from "@/components/nav";
import { WhatsAppWidget } from "@/components/whatsapp";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Loader />
      <Nav />
      <main>
        <Hero />
        <VelocityMarquee
          className="border-b border-line py-8 text-[clamp(3rem,8vw,7rem)] leading-none"
          items={["Corte", "Barba", "Navalha", "Degradê", "Toalha quente", "Acabamento"]}
        />
        <Services />
        <Manifesto />
        <Barbers />
        <HowItWorks />
        <Space />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
