"use client";

import {
  Header,
  Footer,
  HeroSection,
  FeaturedIn,
  ServicesAndFeatures,
  CallToAction,
  FAQSection,
  RequestFeature,
} from "@/components/website";

export default function Home() {
  return (
    <main className=" bg-primary-foreground h-auto text-center scroll-smooth ">
      {/* Header section starts here  */}
      <Header />
      {/* Header section ends here  */}

      {/* Hero section content */}
      <HeroSection />
      {/* Hero section ends here  */}

      {/* Featured in section  */}
      <FeaturedIn />
      {/* featured section ends here  */}

      {/* Services section starts here  */}
      <ServicesAndFeatures />
      {/* Services section ends here  */}

      {/* Call to action section starts here  */}
      <CallToAction />
      {/* Call to action section ends here  */}

      {/* FAQ section starts here  */}
      <FAQSection />
      {/* FAQ section ends here  */}

      {/* Request Feature starts here  */}
      <RequestFeature />
      {/* Request Feature ends here  */}

      {/* Footer section starts here  */}
      <Footer />
      {/* Footer section ends here  */}
    </main>
  );
}
