"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CollaboratorItem } from "@/lib/useItineraryPresence";

interface CollaboratorAvatarsProps {
  collaborators: CollaboratorItem[];
  currentUserId?: string;
}

export function CollaboratorAvatars({ collaborators, currentUserId }: CollaboratorAvatarsProps) {
  const [showPopover, setShowPopover] = useState(false);

  if (!collaborators || collaborators.length === 0) {
    return null;
  }

  const otherCollaborators = collaborators.filter((c) => c.userId !== currentUserId);
  const selfCollaborator = collaborators.find((c) => c.userId === currentUserId);
  const displayList = currentUserId ? [...(selfCollaborator ? [selfCollaborator] : []), ...otherCollaborators] : collaborators;

  return (
    <div className="relative inline-flex items-center">
      <div
        onClick={() => setShowPopover(!showPopover)}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        className="flex items-center gap-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all"
      >
        <span className="flex -space-x-2 overflow-hidden items-center">
          {displayList.slice(0, 4).map((c) => (
            <div
              key={c._id || c.userId}
              style={{ borderColor: c.color }}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold border-2 shadow-xs shrink-0"
              title={`${c.userName} (${c.status === "editing" ? `Editing Day ${c.activeDayIdx + 1}` : `Viewing Day ${c.activeDayIdx + 1}`})`}
            >
              {c.userAvatar ? (
                <img src={c.userAvatar} alt={c.userName} className="h-full w-full object-cover" />
              ) : (
                c.userName.charAt(0).toUpperCase()
              )}
            </div>
          ))}
          {displayList.length > 4 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[9px] font-bold text-slate-300 ring-2 ring-white dark:ring-slate-900 shrink-0">
              +{displayList.length - 4}
            </span>
          )}
        </span>

        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{displayList.length} Live</span>
        </span>
      </div>

      {/* Popover Breakdown */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 text-slate-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-bold text-slate-300">Live Collaborators</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Active Now
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {displayList.map((c) => (
                <div key={c._id || c.userId} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ borderColor: c.color }}
                      className="h-6 w-6 rounded-full border-2 overflow-hidden bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0"
                    >
                      {c.userAvatar ? (
                        <img src={c.userAvatar} alt={c.userName} className="h-full w-full object-cover" />
                      ) : (
                        c.userName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="font-medium text-slate-200 truncate max-w-[110px]">
                      {c.userName} {c.userId === currentUserId ? "(You)" : ""}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      c.status === "editing"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {c.status === "editing" ? `✏️ Day ${c.activeDayIdx + 1}` : `👁️ Day ${c.activeDayIdx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
