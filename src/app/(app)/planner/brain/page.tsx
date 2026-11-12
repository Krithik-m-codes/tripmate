"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type BrainCategory =
  | "hidden_gems"
  | "food_etiquette"
  | "packing"
  | "budget"
  | "safety"
  | "local_customs"
  | "flight_hacks"
  | "general";

interface BrainEntry {
  _id: string;
  title: string;
  destination?: string;
  category: BrainCategory;
  content: string;
  tags: string[];
  isShared?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CombinedResult {
  personalEntries: {
    id: string;
    title: string;
    category: string;
    destination?: string;
    content: string;
    tags: string[];
  }[];
  globalChunks: {
    topic: string;
    content: string;
    tags: string[];
  }[];
}

const CATEGORY_LABELS: Record<BrainCategory, { label: string; icon: string; color: string }> = {
  hidden_gems: { label: "Hidden Gems", icon: "💎", color: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  food_etiquette: { label: "Food & Dining", icon: "🍜", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  packing: { label: "Packing & Gear", icon: "🎒", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  budget: { label: "Budget Hacks", icon: "💰", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  safety: { label: "Safety & Emergency", icon: "🛡️", color: "bg-red-500/15 text-red-300 border-red-500/30" },
  local_customs: { label: "Local Customs", icon: "⛩️", color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  flight_hacks: { label: "Flights & Hotels", icon: "✈️", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  general: { label: "General Wisdom", icon: "💡", color: "bg-slate-500/15 text-slate-300 border-slate-500/30" },
};

export default function TravelBrainPage() {
  const [entries, setEntries] = useState<BrainEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDestination, setFormDestination] = useState("");
  const [formCategory, setFormCategory] = useState<BrainCategory>("hidden_gems");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [saving, setSaving] = useState(false);

  // RAG Test state
  const [testDestination, setTestDestination] = useState("Tokyo, Japan");
  const [testSeason, setTestSeason] = useState("Autumn");
  const [testStyle, setTestStyle] = useState("Food & Culture");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<CombinedResult | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [selectedCategory]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory === "all"
          ? "/api/brain"
          : `/api/brain?category=${selectedCategory}`;
      const res = await axios.get(url);
      if (res.data?.success) {
        setEntries(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch entries:", err);
      toast.error("Failed to load your Travel Brain");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (entry?: BrainEntry) => {
    if (entry) {
      setEditingId(entry._id);
      setFormTitle(entry.title);
      setFormDestination(entry.destination || "");
      setFormCategory(entry.category);
      setFormContent(entry.content);
      setFormTags(entry.tags?.join(", ") || "");
    } else {
      setEditingId(null);
      setFormTitle("");
      setFormDestination("");
      setFormCategory("hidden_gems");
      setFormContent("");
      setFormTags("");
    }
    setIsModalOpen(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Please provide both a title and content notes.");
      return;
    }

    setSaving(true);
    try {
      const tagsArray = formTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title: formTitle,
        destination: formDestination,
        category: formCategory,
        content: formContent,
        tags: tagsArray,
      };

      if (editingId) {
        const res = await axios.patch(`/api/brain/${editingId}`, payload);
        if (res.data?.success) {
          toast.success("Memory updated!");
          fetchEntries();
          setIsModalOpen(false);
        }
      } else {
        const res = await axios.post("/api/brain", payload);
        if (res.data?.success) {
          toast.success("New memory added to your Travel Brain!");
          fetchEntries();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Error saving entry:", err);
      toast.error("Failed to save memory item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from your Travel Brain?`)) {
      return;
    }
    try {
      const res = await axios.delete(`/api/brain/${id}`);
      if (res.data?.success) {
        toast.success("Memory deleted.");
        setEntries((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      toast.error("Failed to delete memory.");
    }
  };

  const handleTestRetrieval = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await axios.get(
        `/api/brain/retrieve?destination=${encodeURIComponent(
          testDestination
        )}&season=${encodeURIComponent(testSeason)}&travelStyle=${encodeURIComponent(
          testStyle
        )}`
      );
      if (res.data?.success) {
        setTestResult(res.data.data);
      }
    } catch (err) {
      console.error("Failed to test RAG retrieval:", err);
      toast.error("Failed to run retrieval test.");
    } finally {
      setTestLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      (entry.destination || "").toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      entry.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 p-4 sm:p-6 lg:p-8">
      {/* Header & Stats Banner */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">📓</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Travel Notes & Tips
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Personalized Assistant Active
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Store your favorite hidden dining gems, flight tips, and personal preferences here. Whenever you ask TripMate to plan a trip, your notes and travel style are automatically woven directly into your custom recommendations.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>+</span>
            <span>Add Travel Note</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              🌐 All Memories ({entries.length})
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === key
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination, title, or tags..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">🔍</span>
          </div>
        </div>

        {/* Memory Chunks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-52 bg-slate-900/60 rounded-2xl border border-slate-800/60" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-4">
            <div className="text-5xl">💡</div>
            <h3 className="text-lg font-semibold text-slate-300">No memory chunks found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "No items match your filter criteria. Try clearing your search."
                : "Your Travel Brain is currently empty! Add your first personal note or hidden gem to start enriching AI itinerary generation."}
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-sm font-semibold transition-all"
            >
              <span>➕ Add Your First Memory</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => {
              const catInfo = CATEGORY_LABELS[entry.category] || CATEGORY_LABELS.general;
              return (
                <div
                  key={entry._id}
                  className="group relative bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-500/5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${catInfo.color}`}>
                        <span>{catInfo.icon}</span>
                        <span>{catInfo.label}</span>
                      </span>

                      {entry.destination && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          📍 {entry.destination}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {entry.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4 font-normal whitespace-pre-line bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                      {entry.content}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/70 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 max-w-[65%] overflow-hidden">
                      {entry.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                      {(entry.tags?.length || 0) > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{entry.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(entry)}
                        title="Edit entry"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry._id, entry.title)}
                        title="Delete entry"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RAG Retrieval Engine Test Bench */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 rounded-3xl border border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  Test Your RAG Retrieval Engine
                </h2>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">
                Simulate an AI itinerary request below. See exactly which of your private memory chunks and which global travel rules the RAG engine retrieves and prioritizes!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Destination</label>
                <input
                  type="text"
                  value={testDestination}
                  onChange={(e) => setTestDestination(e.target.value)}
                  placeholder="e.g. Tokyo, Japan"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Season / Timing</label>
                <input
                  type="text"
                  value={testSeason}
                  onChange={(e) => setTestSeason(e.target.value)}
                  placeholder="e.g. Autumn / October"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Travel Style / Focus</label>
                <input
                  type="text"
                  value={testStyle}
                  onChange={(e) => setTestStyle(e.target.value)}
                  placeholder="e.g. Food tour & culture"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleTestRetrieval}
                disabled={testLoading}
                className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {testLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Retrieving & Ranking...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Test Retrieval Pipeline</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div className="pt-6 border-t border-slate-800/80 space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Chunks Retrieved */}
                  <div className="bg-slate-950/70 rounded-2xl border border-emerald-500/30 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🧠</span>
                        <h3 className="font-bold text-emerald-300 text-sm sm:text-base">
                          Your Retrieved Personal Memories ({testResult.personalEntries?.length || 0})
                        </h3>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        Priority High
                      </span>
                    </div>

                    {(!testResult.personalEntries || testResult.personalEntries.length === 0) ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">
                        No personal notes matched "{testDestination}". Add notes for this destination above to test priority retrieval!
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {testResult.personalEntries.map((item, idx) => (
                          <div key={idx} className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-slate-200">{item.title}</span>
                              {item.destination && (
                                <span className="text-[10px] text-emerald-400 font-mono">📍 {item.destination}</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                              {item.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Global Chunks Retrieved */}
                  <div className="bg-slate-950/70 rounded-2xl border border-slate-800/80 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌐</span>
                        <h3 className="font-bold text-slate-300 text-sm sm:text-base">
                          Retrieved Global Knowledge ({testResult.globalChunks?.length || 0})
                        </h3>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                        Curated Rules
                      </span>
                    </div>

                    {(!testResult.globalChunks || testResult.globalChunks.length === 0) ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">No global chunks matched.</p>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {testResult.globalChunks.map((chunk, idx) => (
                          <div key={idx} className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 space-y-1">
                            <span className="font-semibold text-xs text-slate-300 block">{chunk.topic}</span>
                            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                              {chunk.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>{editingId ? "✏️ Edit Memory Chunk" : "➕ Add to Travel Brain"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Secret Ramen Shop in Shinjuku & Cash Etiquette"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as BrainCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => (
                      <option key={key} value={key}>
                        {icon} {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Destination <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formDestination}
                    onChange={(e) => setFormDestination(e.target.value)}
                    placeholder="e.g. Tokyo, Japan"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Tags <span className="text-slate-500 text-[10px]">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="e.g. ramen, shinjuku, cash-only, dinner"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Knowledge Notes <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write down the exact advice, address, secrets, or rules you want the AI to remember and recommend for your trips..."
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
                  <span>{editingId ? "Update Memory" : "Save to Brain"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
