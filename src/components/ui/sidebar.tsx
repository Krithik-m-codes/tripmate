"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/authClient";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => (
  <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
    {children}
  </SidebarProvider>
);

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<"div">)} />
  </>
);

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "hidden h-full flex-col border-r border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#070707] px-3 py-4 md:flex transition-colors duration-200",
        className
      )}
      animate={{ width: animate ? (open ? "240px" : "60px") : "240px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "flex h-14 w-full flex-row items-center justify-between border-b border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#070707] px-4 md:hidden transition-colors duration-200"
      )}
      {...props}
    >
      <div className="z-20 flex w-full justify-end">
        <IconMenu2 className="text-zinc-700 dark:text-zinc-200" onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[100] flex flex-col justify-between bg-white dark:bg-[#070707] p-8 transition-colors duration-200",
              className
            )}
          >
            <div
              className="absolute right-8 top-8 z-50 text-zinc-600 dark:text-zinc-300 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === link.href;
  const isSignOut = link.label === "Sign Out";

  return (
    <Link
      href={link.href}
      onClick={(e) => {
        if (isSignOut) {
          e.preventDefault();
          signOut({ callbackUrl: "/" });
        }
      }}
      className={cn(
        "group/sidebar flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-150 relative",
        isActive
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold"
          : isSignOut
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
            : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400",
        className
      )}
      {...props}
    >
      {/* Active bar */}
      <span
        className={cn(
          "absolute left-0 h-5 w-0.5 rounded-r-full bg-emerald-600 dark:bg-emerald-400 transition-all",
          isActive ? "opacity-100" : "opacity-0"
        )}
      />

      <span
        className={cn(
          "shrink-0 transition-colors",
          isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 group-hover/sidebar:text-emerald-600 dark:group-hover/sidebar:text-emerald-400"
        )}
      >
        {link.icon}
      </span>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="inline-block !m-0 !p-0 whitespace-pre"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
