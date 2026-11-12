"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Trash2,
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  Save,
  Check,
  X,
  Edit2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import type { StructuredItinerary, Activity, ItineraryDay } from "@/schemas/itinerarySchema";
import { TripCommentsDrawer } from "@/components/TripCommentsDrawer";
import { useItineraryPresence } from "@/lib/useItineraryPresence";
import { CollaboratorAvatars } from "@/components/CollaboratorAvatars";

interface SortableActivityItemProps {
  activity: Activity;
  dayIdx: number;
  onDelete: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onOpenNotes?: (activity: Activity) => void;
  noteCount?: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  sightseeing: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
  food: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" },
  transport: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300" },
  accommodation: { bg: "bg-purple-100 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300" },
  activity: { bg: "bg-teal-100 dark:bg-teal-950", text: "text-teal-700 dark:text-teal-300" },
  shopping: { bg: "bg-pink-100 dark:bg-pink-950", text: "text-pink-700 dark:text-pink-300" },
  nightlife: { bg: "bg-indigo-100 dark:bg-indigo-950", text: "text-indigo-700 dark:text-indigo-300" },
};

function SortableActivityItem({ activity, dayIdx, onDelete, onEdit, onOpenNotes, noteCount }: SortableActivityItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const catStyle =
    CATEGORY_COLORS[activity.category] || { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start justify-between gap-3 rounded-2xl border ${
        isDragging
          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-lg"
          : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
      } p-4 transition-all shadow-sm`}
    >
      <div className="flex items-start gap-3 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Drag to reorder activity"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">{activity.title}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${catStyle.bg} ${catStyle.text}`}>
              {activity.category}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 capitalize">
              {activity.timeSlot}
            </span>
            {activity.isHiddenGem && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                ✨ Hidden Gem
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activity.description}</p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {activity.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-emerald-600" /> {activity.duration}
              </span>
            )}
            {activity.location?.name && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-600" /> {activity.location.name}
              </span>
            )}
            {activity.estimatedCost && typeof activity.estimatedCost.amount === "number" && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-600" /> ${activity.estimatedCost.amount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onOpenNotes && (
          <button
            type="button"
            onClick={() => onOpenNotes(activity)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors flex items-center gap-1"
            title="Activity Notes & Comments"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {(noteCount || 0) > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{noteCount}</span>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit(activity)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
          title="Edit activity"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(activity.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
          title="Delete activity"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

interface ItineraryEditorProps {
  initialItinerary: StructuredItinerary;
  onSave: (updated: StructuredItinerary) => void;
  onClose?: () => void;
  itineraryId?: string;
  currentUserId?: string;
}

export default function ItineraryEditor({
  initialItinerary,
  onSave,
  onClose,
  itineraryId,
  currentUserId,
}: ItineraryEditorProps) {
  const [itinerary, setItinerary] = useState<StructuredItinerary>(initialItinerary);
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Form state for adding/editing an activity
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTimeSlot, setFormTimeSlot] = useState<Activity["timeSlot"]>("morning");
  const [formCategory, setFormCategory] = useState<Activity["category"]>("sightseeing");
  const [formDuration, setFormDuration] = useState("2 hours");
  const [formCost, setFormCost] = useState("0");
  const [formLocation, setFormLocation] = useState("");
  const [formIsHiddenGem, setFormIsHiddenGem] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Comments / Notes Drawer State
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsTargetId, setCommentsTargetId] = useState("all");
  const [commentsTargetType, setCommentsTargetType] = useState<"itinerary" | "day" | "activity">("itinerary");
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const { collaborators, broadcastRemoteUpdate } = useItineraryPresence({
    itineraryId,
    currentUserId,
    activeDayIdx,
    status: showForm || editingActivity ? "editing" : "viewing",
    onRemoteItineraryUpdate: (remoteItinerary, senderName) => {
      setItinerary(remoteItinerary);
      toast.info(`${senderName} synchronized changes across your workspace 🔄`);
    },
  });

  React.useEffect(() => {
    if (itineraryId) {
      fetchCommentCounts();
    }
  }, [itineraryId, isCommentsOpen]);

  const fetchCommentCounts = async () => {
    if (!itineraryId) return;
    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/comments`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const counts: Record<string, number> = {};
        data.data.forEach((c: any) => {
          if (c.targetId) {
            counts[c.targetId] = (counts[c.targetId] || 0) + 1;
          }
        });
        setCommentCounts(counts);
      }
    } catch (e) {
      console.error("Error fetching comment counts:", e);
    }
  };

  const handleOpenActivityNotes = (act: Activity) => {
    setCommentsTargetId(act.id);
    setCommentsTargetType("activity");
    setIsCommentsOpen(true);
  };

  const handleOpenGeneralNotes = () => {
    setCommentsTargetId("all");
    setCommentsTargetType("itinerary");
    setIsCommentsOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentDay = itinerary.days[activeDayIdx] || itinerary.days[0];
  const currentActivities = currentDay?.activities || [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !currentDay) return;

    const oldIndex = currentActivities.findIndex((item) => item.id === active.id);
    const newIndex = currentActivities.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newActivities = arrayMove(currentActivities, oldIndex, newIndex);
      updateDayActivities(newActivities);
    }
  };

  const updateDayActivities = (newActivities: Activity[]) => {
    setItinerary((prev) => {
      const nextDays = [...prev.days];
      if (nextDays[activeDayIdx]) {
        nextDays[activeDayIdx] = {
          ...nextDays[activeDayIdx],
          activities: newActivities,
        };
      }
      const nextItinerary = { ...prev, days: nextDays };
      broadcastRemoteUpdate(nextItinerary);
      return nextItinerary;
    });
  };

  const handleOpenAddForm = () => {
    setEditingActivity(null);
    setFormTitle("");
    setFormDescription("");
    setFormTimeSlot("morning");
    setFormCategory("sightseeing");
    setFormDuration("2 hours");
    setFormCost("15");
    setFormLocation("");
    setFormIsHiddenGem(false);
    setShowForm(true);
  };

  const handleOpenEditForm = (act: Activity) => {
    setEditingActivity(act);
    setFormTitle(act.title);
    setFormDescription(act.description);
    setFormTimeSlot(act.timeSlot);
    setFormCategory(act.category);
    setFormDuration(act.duration || "");
    setFormCost(act.estimatedCost?.amount ? String(act.estimatedCost.amount) : "0");
    setFormLocation(act.location?.name || "");
    setFormIsHiddenGem(Boolean(act.isHiddenGem));
    setShowForm(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Please enter a title for the activity.");
      return;
    }

    const costNum = Number(formCost) || 0;
    const activityData: Activity = {
      id: editingActivity ? editingActivity.id : `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim(),
      description: formDescription.trim() || "Enjoy this activity at your own pace.",
      timeSlot: formTimeSlot,
      category: formCategory,
      duration: formDuration.trim() || undefined,
      isHiddenGem: formIsHiddenGem,
      estimatedCost: costNum > 0 ? { amount: costNum, currency: "USD" } : undefined,
      location: formLocation.trim() ? { name: formLocation.trim() } : undefined,
    };

    if (editingActivity) {
      const updated = currentActivities.map((a) => (a.id === editingActivity.id ? activityData : a));
      updateDayActivities(updated);
      toast.success("Activity updated!");
    } else {
      updateDayActivities([...currentActivities, activityData]);
      toast.success("New activity added!");
    }

    setShowForm(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = currentActivities.filter((a) => a.id !== id);
    updateDayActivities(updated);
    toast.info("Activity removed");
  };

  const handleAddDay = () => {
    const newDayNum = itinerary.days.length + 1;
    const newDay: ItineraryDay = {
      day: newDayNum,
      date: `Day ${newDayNum}`,
      theme: "Exploration & Leisure",
      activities: [],
      dailyCostEstimate: 0,
    };
    setItinerary((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
    }));
    setActiveDayIdx(itinerary.days.length);
    toast.success(`Day ${newDayNum} added!`);
  };

  const handleDeleteCurrentDay = () => {
    if (itinerary.days.length <= 1) {
      toast.error("An itinerary must have at least one day.");
      return;
    }
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== activeDayIdx).map((d, idx) => ({ ...d, day: idx + 1 })),
    }));
    setActiveDayIdx((prev) => Math.max(0, prev - 1));
    toast.info("Day removed");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Interactive Drag & Drop Editor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Reorder activities with the grip handle, add custom stops, and tailor your schedule exactly to your taste
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <CollaboratorAvatars collaborators={collaborators} currentUserId={currentUserId} />
          {itineraryId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenGeneralNotes}
              className="rounded-xl h-9 text-xs font-semibold gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>Discussion Notes</span>
              {Object.values(commentCounts).reduce((a, b) => a + b, 0) > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px]">
                  {Object.values(commentCounts).reduce((a, b) => a + b, 0)}
                </span>
              )}
            </Button>
          )}
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl h-9 text-xs font-semibold">
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              onSave(itinerary);
              broadcastRemoteUpdate(itinerary);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 gap-1.5 text-xs font-semibold shadow-md shadow-emerald-600/20"
          >
            <Save className="h-3.5 w-3.5" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {itinerary.days.map((day, idx) => (
            <button
              key={day.day}
              type="button"
              onClick={() => {
                setActiveDayIdx(idx);
                setShowForm(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeDayIdx === idx
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Day {day.day}: {day.theme ? (day.theme.length > 18 ? `${day.theme.slice(0, 18)}...` : day.theme) : `Day ${day.day}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddDay}
            className="rounded-xl h-8 text-[11px] font-semibold gap-1 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
          >
            <Plus className="h-3 w-3" /> Add Day
          </Button>
          {itinerary.days.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDeleteCurrentDay}
              className="rounded-xl h-8 text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 px-2"
              title="Delete current day"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Current Day Theme Input */}
      {currentDay && (
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Day {currentDay.day} Theme:</span>
          <Input
            value={currentDay.theme || ""}
            onChange={(e) => {
              const val = e.target.value;
              setItinerary((prev) => {
                const nextDays = [...prev.days];
                if (nextDays[activeDayIdx]) nextDays[activeDayIdx] = { ...nextDays[activeDayIdx], theme: val };
                return { ...prev, days: nextDays };
              });
            }}
            placeholder="e.g. Historic Temples & Street Food"
            className="h-8 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs font-semibold"
          />
        </div>
      )}

      {/* Activities Drag & Drop Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Day {currentDay?.day} Activities ({currentActivities.length})
          </h3>
          <Button
            type="button"
            size="sm"
            onClick={handleOpenAddForm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8 text-xs font-semibold gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Activity
          </Button>
        </div>

        {showForm && (
          <Card className="rounded-2xl border border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-lg p-5 animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>{editingActivity ? "Edit Activity" : "Add New Activity"}</span>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </h4>
            <form onSubmit={handleSaveActivity} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Title *</label>
                <Input
                  required
                  placeholder="e.g. Fushimi Inari Shrine Visit"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Time Slot</label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value as Activity["timeSlot"])}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Activity["category"])}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transport</option>
                    <option value="activity">Activity / Tour</option>
                    <option value="shopping">Shopping</option>
                    <option value="nightlife">Nightlife</option>
                    <option value="accommodation">Accommodation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Duration</label>
                  <Input
                    placeholder="e.g. 2 hours"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Location / Address</label>
                  <Input
                    placeholder="e.g. 68 Fukakusa, Fushimi Ward"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Estimated Cost ($ USD)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Description / Notes</label>
                <Textarea
                  placeholder="What to do, insider tips, or ticket details..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="rounded-xl text-xs h-20"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hiddenGemCheck"
                  checked={formIsHiddenGem}
                  onChange={(e) => setFormIsHiddenGem(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="hiddenGemCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  ✨ Mark as a lesser-known Hidden Gem
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold">
                  {editingActivity ? "Save Changes" : "Add Activity"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {currentActivities.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-slate-400">
            <Clock className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm font-medium">No activities planned for Day {currentDay?.day} yet.</p>
            <p className="text-xs mt-1">Click "Add Activity" above to start scheduling!</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={currentActivities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {currentActivities.map((act) => (
                  <SortableActivityItem
                    key={act.id}
                    activity={act}
                    dayIdx={activeDayIdx}
                    onDelete={handleDeleteActivity}
                    onEdit={handleOpenEditForm}
                    onOpenNotes={itineraryId ? handleOpenActivityNotes : undefined}
                    noteCount={commentCounts[act.id] || 0}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {itineraryId && (
        <TripCommentsDrawer
          itineraryId={itineraryId}
          isOpen={isCommentsOpen}
          onClose={() => {
            setIsCommentsOpen(false);
            fetchCommentCounts();
          }}
          initialTargetId={commentsTargetId}
          initialTargetType={commentsTargetType}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
