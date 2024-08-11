import { Header, Footer } from "@/components/website";

// Code for the layout component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // conditionally render header and footer components
  // to not render on login and register pages
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
