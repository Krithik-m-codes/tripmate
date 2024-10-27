import { Header, Footer } from "@/components/website";
import React from "react";

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
