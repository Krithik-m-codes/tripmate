"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconLogout2,
  IconLayoutDashboard,
  IconBrandTabler,
  IconMap2,
  IconHistory,
  IconHeart,
  IconUserBolt,
  IconHistoryToggle,
  IconCompass,
  IconWallet,
  IconChecklist,
  IconCpu,
  IconBrain,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/authClient";
import ThemeToggle from "./ThemeToggle";

const ICON = "h-5 w-5 shrink-0";

export function MainSideBar({ children }: React.PropsWithChildren<object>) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconLayoutDashboard className={ICON} />,
    },
    {
      label: "AI Trip Planner",
      href: "/planner/ai-generator",
      icon: <IconBrandTabler className={ICON} />,
    },
    {
      label: "Explore Map",
      href: "/explore/map",
      icon: <IconMap2 className={ICON} />,
    },
    {
      label: "Saved Itineraries",
      href: "/planner/recent",
      icon: <IconHistoryToggle className={ICON} />,
    },
    {
      label: "Saved Places",
      href: "/explore/saved",
      icon: <IconHeart className={ICON} />,
    },
    {
      label: "Travel Notes & Tips",
      href: "/planner/brain",
      icon: <IconBrain className={ICON} />,
    },
    {
      label: "Budget Tracker",
      href: "/planner/budget",
      icon: <IconWallet className={ICON} />,
    },
    {
      label: "Packing Checklists",
      href: "/planner/checklist",
      icon: <IconChecklist className={ICON} />,
    },
    {
      label: "Profile",
      href: "/settings/profile",
      icon: <IconUserBolt className={ICON} />,
    },
    {
      label: "Sign Out",
      href: "/",
      icon: <IconLogout2 className={ICON} />,
    },
  ];

  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div
      className={cn(
        "flex h-screen w-full flex-col overflow-hidden md:flex-row transition-colors duration-300",
        "bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="relative mt-8 flex flex-col gap-1">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom user link & theme toggle */}
          <div className="border-t border-zinc-200/80 dark:border-white/10 pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between px-2">
              {open && <span className="text-xs font-heading font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Theme</span>}
              <ThemeToggle />
            </div>
            <SidebarLink
              link={{
                label: session?.user?.name ?? "Account",
                href: "/settings/profile",
                icon: (
                  <Image
                    src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "U")}&background=059669&color=fff`}
                    className="h-7 w-7 shrink-0 rounded-full ring-2 ring-emerald-500/20"
                    width={28}
                    height={28}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex h-full w-full flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50 dark:bg-[#050505] transition-colors duration-300">
        {children}
      </div>
    </div>
  );
}

export const Logo = () => (
  <Link
    href="/"
    className="relative z-20 flex items-center gap-2.5 py-1 text-sm font-normal text-zinc-900 dark:text-white hover:opacity-80 transition-opacity"
  >
    <Image
      src="/tripmate-logo.png"
      alt="Logo"
      width={36}
      height={36}
      className="rounded-full ring-2 ring-emerald-500/20"
    />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-pre font-heading font-extrabold tracking-tight text-gradient text-xl"
    >
      TripMate
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link href="/" className="relative z-20 flex items-center gap-2 py-1">
    <Image
      src="/tripmate-logo.png"
      alt="Logo"
      width={36}
      height={36}
      className="rounded-full"
    />
  </Link>
);
