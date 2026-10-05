import type { Metadata } from "next";
import { faqLd } from "@/lib/site";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { faq } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/content";
import { PixelStars } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/PixelStars";
import { Budgets } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Budgets";
import { Articles } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Articles";
import { CaseStudy } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/CaseStudy";
import { Contact } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Contact";
import { Faq } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Faq";
import { Footer } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Footer";
import { Header } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Header";
import { Hero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Hero";
import { Pricing } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Pricing";
import { Process } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Process";
import { Services } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Services";
import { Team } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Team";
import { Testimonials } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Testimonials";
import { WhyUs } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/WhyUs";
import { Works } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Works";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd(faq.items)} />
      <Header />
      <main className="relative bg-ink">
        {/* Sparkles scattered down the whole page; sections with their own backgrounds cover them */}
        <PixelStars seed={7} count={44} />
        <Hero />
        <Services />
        <Process />
        <Works />
        <CaseStudy />
        <Testimonials />
        <Budgets />
        <Pricing />
        <WhyUs />
        <Team />
        <Faq />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
