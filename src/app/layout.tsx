import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "../context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TripMate - Travel App",
  description:
    "TripMate is a travel app that helps you plan your trips, save your favorite places and share them with your friends. and much more !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // conditionally render header and footer components
  // to not render on login and register pages
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={cn(inter.className, {
            "debug-screens": process.env.NODE_ENV === "development",
          })}
        >
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </body>
      </AuthProvider>
    </html>
  );
}
