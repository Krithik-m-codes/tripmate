"use client";

import React, { useState, useEffect, Suspense } from "react";

import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/loadingSpinner";
import { useSession } from "next-auth/react";
import { MainSideBar } from "@/components/SideBar";
import SkeletonDashboard from "@/components/SkeletonDashboard";

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
        session ? (
          <Suspense fallback={<LoadingSpinner />}>
            <MainSideBar>
              <Suspense fallback={<SkeletonDashboard />}>
                <div className="flex flex-col w-full min-h-screen h-full">
                  {children}
                </div>
              </Suspense>
            </MainSideBar>
          </Suspense>
        ) : (
          <div className="flex flex-col w-full min-h-screen h-full">
            {children}
          </div>
        )
      )}
    </div>
  );
};

export default Layout;
