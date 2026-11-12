import type { Metadata } from "next";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/marketing/Hero";
import { WatchItWork } from "@/components/marketing/WatchItWork";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FeatureSlices } from "@/components/marketing/FeatureSlices";
import { Proof } from "@/components/marketing/Proof";
import { FaqSection } from "@/components/marketing/FaqSection";
import { FinalCta } from "@/components/marketing/FinalCta";
import { FAQS } from "@/lib/faq";
import {
  faqPageSchema,
  softwareApplicationSchema,
  webPageSchema,
} from "@/lib/schema";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema(),
          faqPageSchema(FAQS),
          webPageSchema({
            path: "/",
            title: SITE_TITLE,
            description: SITE_DESCRIPTION,
          }),
        ]}
      />
      <Header />
      <main id="main-content">
        <Hero />
        <WatchItWork />
        <HowItWorks />
        <FeatureSlices />
        <Proof />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
