import { Header, Footer } from "@/components/website";

/**
 * Shared chrome for public marketing pages. Keeping Header/Footer here means
 * new content routes do not have to duplicate them, and every marketing page
 * gets the same skip-link target.
 */
export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
