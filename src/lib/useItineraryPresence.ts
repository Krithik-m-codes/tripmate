"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import type { StructuredItinerary } from "@/schemas/itinerarySchema";

export interface CollaboratorItem {
  _id: string;
  itineraryId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  color: string;
  status: "viewing" | "editing";
  activeDayIdx: number;
  lastHeartbeat: string;
}

interface UseItineraryPresenceOptions {
  itineraryId?: string;
  currentUserId?: string;
  activeDayIdx?: number;
  status?: "viewing" | "editing";
  onRemoteItineraryUpdate?: (updatedItinerary: StructuredItinerary, senderName: string) => void;
}

export function useItineraryPresence({
  itineraryId,
  currentUserId,
  activeDayIdx = 0,
  status = "viewing",
  onRemoteItineraryUpdate,
}: UseItineraryPresenceOptions) {
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Setup BroadcastChannel for zero-latency local/multi-tab sync
  useEffect(() => {
    if (!itineraryId || typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }

    const channelName = `tripmate-itinerary-sync-${itineraryId}`;
    const bc = new BroadcastChannel(channelName);
    channelRef.current = bc;

    bc.onmessage = (event) => {
      const { type, payload, senderId, senderName } = event.data || {};
      if (senderId === currentUserId) return; // ignore our own broadcast

      if (type === "ITINERARY_UPDATED" && payload && onRemoteItineraryUpdate) {
        onRemoteItineraryUpdate(payload, senderName || "A collaborator");
      }
    };

    return () => {
      bc.close();
      channelRef.current = null;
    };
  }, [itineraryId, currentUserId, onRemoteItineraryUpdate]);

  const sendHeartbeat = useCallback(async () => {
    if (!itineraryId || !currentUserId) return;
    try {
      const res = await axios.post(`/api/itineraries/${itineraryId}/presence`, {
        status,
        activeDayIdx,
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCollaborators(res.data.data);
      }
    } catch (err) {
      console.error("Presence heartbeat error:", err);
    }
  }, [itineraryId, currentUserId, status, activeDayIdx]);

  useEffect(() => {
    if (!itineraryId || !currentUserId) return;

    sendHeartbeat();
    const interval = setInterval(() => {
      sendHeartbeat();
    }, 12000); // 12 seconds

    return () => clearInterval(interval);
  }, [sendHeartbeat, itineraryId, currentUserId]);

  const broadcastRemoteUpdate = useCallback(
    (updatedItinerary: StructuredItinerary, senderName: string = "A collaborator") => {
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "ITINERARY_UPDATED",
          payload: updatedItinerary,
          senderId: currentUserId,
          senderName,
        });
      }
    },
    [currentUserId]
  );

  return {
    collaborators,
    broadcastRemoteUpdate,
    refreshPresence: sendHeartbeat,
  };
}
