"use client";

import React, { useState, useEffect } from "react";
import SideNavbar from "../../components/SideNavBar";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/loadingSpinner";
import { useSession } from "next-auth/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  return (
    <div className={cn("flex min-h-screen w-full bg-white text-black")}>
      {/* Side navigation bar */}
      {session && <SideNavbar />}
      {/* Main content */}
      <div
        className={
          cn("w-full h-screen", session ? "pl-3" : "pl-0") + " transition-all"
        }
      >
        {loading ? <LoadingSpinner /> : children}
      </div>
    </div>
  );
};

export default Layout;
