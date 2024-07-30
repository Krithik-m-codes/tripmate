"use client";

import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/loadingSpinner";
import { useSession } from "next-auth/react";
import { MainSideBar } from "@/components/SideBar";

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
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {session ? (
            <MainSideBar>{children}</MainSideBar>
          ) : (
            <div className="flex flex-col w-full">{children}</div>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
