import { get, set, del } from "idb-keyval";

const ITINERARIES_KEY = "tripmate_offline_itineraries";
const PLACES_KEY = "tripmate_offline_places";
const CHECKLISTS_KEY = "tripmate_offline_checklists";
const PENDING_EDITS_KEY = "tripmate_pending_sync_edits";

export interface PendingEdit {
  id: string;
  type: "itinerary_update" | "checklist_toggle" | "note_add";
  targetId: string;
  payload: any;
  timestamp: number;
}

/**
 * Cache itineraries to IndexedDB
 */
export async function cacheItinerariesOffline(itineraries: any[]): Promise<void> {
  if (typeof window === "undefined" || !itineraries) return;
  try {
    await set(ITINERARIES_KEY, {
      data: itineraries,
      cachedAt: Date.now(),
    });
  } catch (err) {
    console.error("Failed to cache itineraries to IndexedDB:", err);
  }
}

/**
 * Get offline cached itineraries from IndexedDB
 */
export async function getOfflineItineraries(): Promise<{ data: any[]; cachedAt: number } | null> {
  if (typeof window === "undefined") return null;
  try {
    const cached = await get(ITINERARIES_KEY);
    return cached || null;
  } catch (err) {
    console.error("Failed to read offline itineraries from IndexedDB:", err);
    return null;
  }
}

/**
 * Cache saved places to IndexedDB
 */
export async function cachePlacesOffline(places: any[]): Promise<void> {
  if (typeof window === "undefined" || !places) return;
  try {
    await set(PLACES_KEY, {
      data: places,
      cachedAt: Date.now(),
    });
  } catch (err) {
    console.error("Failed to cache places to IndexedDB:", err);
  }
}

/**
 * Get offline cached places from IndexedDB
 */
export async function getOfflinePlaces(): Promise<{ data: any[]; cachedAt: number } | null> {
  if (typeof window === "undefined") return null;
  try {
    const cached = await get(PLACES_KEY);
    return cached || null;
  } catch (err) {
    console.error("Failed to read offline places from IndexedDB:", err);
    return null;
  }
}

/**
 * Cache packing checklists to IndexedDB
 */
export async function cacheChecklistsOffline(checklists: any[]): Promise<void> {
  if (typeof window === "undefined" || !checklists) return;
  try {
    await set(CHECKLISTS_KEY, {
      data: checklists,
      cachedAt: Date.now(),
    });
  } catch (err) {
    console.error("Failed to cache checklists to IndexedDB:", err);
  }
}

/**
 * Get offline cached checklists from IndexedDB
 */
export async function getOfflineChecklists(): Promise<{ data: any[]; cachedAt: number } | null> {
  if (typeof window === "undefined") return null;
  try {
    const cached = await get(CHECKLISTS_KEY);
    return cached || null;
  } catch (err) {
    console.error("Failed to read offline checklists from IndexedDB:", err);
    return null;
  }
}

/**
 * Queue a pending edit when offline so it can be synced when reconnected
 */
export async function queuePendingEdit(edit: Omit<PendingEdit, "id" | "timestamp">): Promise<PendingEdit> {
  if (typeof window === "undefined") return { ...edit, id: "local", timestamp: Date.now() };
  try {
    const current: PendingEdit[] = (await get(PENDING_EDITS_KEY)) || [];
    const newEdit: PendingEdit = {
      ...edit,
      id: `pending_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
    };
    current.push(newEdit);
    await set(PENDING_EDITS_KEY, current);
    return newEdit;
  } catch (err) {
    console.error("Failed to queue pending edit:", err);
    return { ...edit, id: "local", timestamp: Date.now() };
  }
}

/**
 * Get all queued pending edits
 */
export async function getPendingEdits(): Promise<PendingEdit[]> {
  if (typeof window === "undefined") return [];
  try {
    return (await get(PENDING_EDITS_KEY)) || [];
  } catch (err) {
    return [];
  }
}

/**
 * Clear pending edits after successful sync
 */
export async function clearPendingEdits(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await del(PENDING_EDITS_KEY);
  } catch (err) {
    console.error("Failed to clear pending edits:", err);
  }
}
