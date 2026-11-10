import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Barbers } from "@/components/home/barbers";
import { Contact, FinalCta, Footer, HowItWorks, Space } from "@/components/home/rest";
import { Loader } from "@/components/loader";
import { Nav } from "@/components/nav";
import { WhatsAppWidget } from "@/components/whatsapp";

export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Services />
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
