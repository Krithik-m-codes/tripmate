"use client";

import React from "react";
import SideNavbar from "../../components/SideNavBar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  return (
    <div className={cn("flex min-h-screen w-full bg-white text-black ")}>
      {/* Side navigation bar  */}
      {session && <SideNavbar />}
      {/* Main content */}
      <div className="md:pl-3 w-full">{children}</div>
    </div>
  );
};

export default Layout;
