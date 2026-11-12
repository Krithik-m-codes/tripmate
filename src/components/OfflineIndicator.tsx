"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw, CheckCircle2, Database } from "lucide-react";
import { getPendingEdits, clearPendingEdits } from "@/lib/offlineSync";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check initial status
    setIsOffline(!navigator.onLine);

    async function checkPending() {
      const edits = await getPendingEdits();
      setPendingCount(edits.length);
    }
    checkPending();

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
      checkPending();
    };

    const handleOnline = async () => {
      setIsOffline(false);
      setJustReconnected(true);
      
      const edits = await getPendingEdits();
      if (edits.length > 0) {
        setIsSyncing(true);
        // Simulate background sync processing
        setTimeout(async () => {
          await clearPendingEdits();
          setPendingCount(0);
          setIsSyncing(false);
        }, 1800);
      }

      setTimeout(() => {
        setJustReconnected(false);
      }, 5000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !justReconnected && !isSyncing && pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm w-full">
      {isOffline && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/90 dark:bg-amber-950/95 backdrop-blur-xl p-4 text-amber-100 shadow-xl shadow-amber-900/20 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <WifiOff className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Offline Mode Active
              </h4>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                Cached Data
              </span>
            </div>
            <p className="text-xs leading-relaxed text-amber-200/90">
              You are currently offline. TripMate is serving your itineraries and checklists from local IndexedDB storage.
            </p>
            {pendingCount > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-amber-900/40 px-2.5 py-1 rounded-lg">
                <Database className="h-3 w-3" />
                <span>{pendingCount} offline action{pendingCount > 1 ? "s" : ""} queued to sync upon reconnection.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {isSyncing && (
        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/95 backdrop-blur-xl p-4 text-white shadow-xl shadow-blue-900/20 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Syncing Offline Edits
            </h4>
            <p className="text-xs text-slate-300">
              Reconnected! Synchronizing your queued changes back to the cloud...
            </p>
          </div>
        </div>
      )}

      {!isOffline && justReconnected && !isSyncing && (
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/95 backdrop-blur-xl p-4 text-white shadow-xl shadow-emerald-900/20 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Connection Restored
            </h4>
            <p className="text-xs text-slate-300">
              You are back online and synchronized with cloud servers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
