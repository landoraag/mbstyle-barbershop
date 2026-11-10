import { Suspense } from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { WhatsAppWidget } from "@/components/whatsapp";
import { BookingFlow } from "@/components/booking/flow";

export const metadata: Metadata = { title: "Agendar horário" };

export default function AgendarPage() {
  return (
    <>
      <Nav />
      <main className="min-h-dvh pt-28 pb-24">
        <Suspense>
          <BookingFlow />
        </Suspense>
      </main>
      <WhatsAppWidget raised />
    </>
  );
}
