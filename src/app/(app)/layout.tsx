"use client";
import React, { Suspense } from "react";
import { useSession } from "@/lib/authClient";
import { MainSideBar } from "@/components/SideBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import OnboardingModal from "@/components/OnboardingModal";
import OfflineIndicator from "@/components/OfflineIndicator";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { Loader2 } from "lucide-react";
import { TripmateLoader } from "@/components/TripmateLoader";

function GlobalLoader() {
  return <TripmateLoader size="fullscreen" />;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") return <GlobalLoader />;

  if (session) {
    return (
      <Suspense fallback={<GlobalLoader />}>
        <MainSideBar>
          <Suspense fallback={<DashboardSkeleton />}>
            <div className="flex h-full w-full flex-col overflow-hidden bg-zinc-50 dark:bg-[#050505] transition-colors duration-300 pb-16 md:pb-0">
              {children}
            </div>
            <MobileBottomNav />
            <OnboardingModal />
            <OfflineIndicator />
          </Suspense>
        </MainSideBar>
      </Suspense>
    );
  }

  // Not authenticated — render page without sidebar (auth pages handle their own UI)
  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#050505] transition-colors duration-300">
      {children}
    </div>
  );
};

export default Layout;
