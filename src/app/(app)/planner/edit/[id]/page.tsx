"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import ItineraryEditor from "@/components/ItineraryEditor";
import { isStructuredItinerary, type StructuredItinerary } from "@/schemas/itinerarySchema";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import { triggerSuccessBurst } from "@/lib/confetti";
import { useSession } from "@/lib/authClient";
import { TripmateLoader } from "@/components/TripmateLoader";

export default function EditItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [itineraryItem, setItineraryItem] = useState<any>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tabMode, setTabMode] = useState<"edit" | "timeline">("edit");

  useEffect(() => {
    if (!id) return;
    async function loadItinerary() {
      try {
        const res = await fetch(`/api/itineraries/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setItineraryItem(data.data);
        } else {
          setError(data.message || "Failed to load itinerary");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    loadItinerary();
  }, [id]);

  const handleSaveStructured = async (updatedItinerary: StructuredItinerary) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/itineraries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itinerary: updatedItinerary,
          destination: updatedItinerary.destination || itineraryItem.destination,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItineraryItem(data.data);
        triggerSuccessBurst();
        toast.success("Itinerary saved successfully!");
      } else {
        toast.error(data.message || "Failed to update itinerary");
      }
    } catch (err) {
      toast.error("Error saving itinerary");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLegacy = async (newText: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/itineraries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itinerary: newText,
          destination: itineraryItem.destination,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItineraryItem(data.data);
        triggerSuccessBurst();
        toast.success("Text saved successfully!");
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch (err) {
      toast.error("Error saving text");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <TripmateLoader size="fullscreen" message="Loading interactive travel editor..." />;
  }

  if (error || !itineraryItem) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Could Not Load Itinerary</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6">{error || "Itinerary not found or you don't have permission to edit it."}</p>
        <Button onClick={() => router.back()} className="rounded-xl gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const { destination = "Trip Itinerary", itinerary, itineraryFormat = "legacy" } = itineraryItem;
  const isStructured = itineraryFormat === "structured" || isStructuredItinerary(itinerary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 space-y-6 pb-28">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-xl gap-1.5 text-xs font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to Trips
          </Button>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            {destination}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 text-xs font-bold shadow-xs">
            <button
              type="button"
              onClick={() => setTabMode("edit")}
              className={`px-3 py-1 rounded-lg transition-all ${
                tabMode === "edit" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Interactive Editor
            </button>
            <button
              type="button"
              onClick={() => setTabMode("timeline")}
              className={`px-3 py-1 rounded-lg transition-all ${
                tabMode === "timeline" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl p-6 md:p-8">
        {tabMode === "timeline" ? (
          <ItineraryTimeline itineraryData={itinerary} destination={destination} />
        ) : isStructured ? (
          <ItineraryEditor
            initialItinerary={itinerary as StructuredItinerary}
            onSave={handleSaveStructured}
            onClose={() => router.back()}
            itineraryId={id}
            currentUserId={(session?.user as any)?.id}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-semibold bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>This is a legacy plain text itinerary. You can edit the text directly below.</span>
            </div>
            <textarea
              defaultValue={typeof itinerary === "string" ? itinerary : Array.isArray(itinerary) ? itinerary.join("\n\n") : JSON.stringify(itinerary, null, 2)}
              id="legacyEditorText"
              rows={20}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => router.back()} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const el = document.getElementById("legacyEditorText") as HTMLTextAreaElement;
                  if (el) handleSaveLegacy(el.value);
                }}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Save Text
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
