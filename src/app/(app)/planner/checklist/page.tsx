"use client";
import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
  Circle,
  Briefcase,
  Shirt,
  Sparkles as SparklesIcon,
  Laptop,
  FileText,
  Tag,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { triggerChecklistComplete, triggerSuccessBurst } from "@/lib/confetti";

interface PackingItem {
  id: string;
  text: string;
  category: "Essentials" | "Clothing" | "Toiletries" | "Electronics" | "Documents" | "Custom";
  checked: boolean;
}

interface PackingChecklist {
  _id?: string;
  tripName: string;
  destination: string;
  items: PackingItem[];
}

const CATEGORIES: {
  key: PackingItem["category"];
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { key: "Essentials", label: "Essentials & Daily", icon: <Briefcase className="h-4 w-4" />, color: "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300" },
  { key: "Clothing", label: "Clothing & Footwear", icon: <Shirt className="h-4 w-4" />, color: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300" },
  { key: "Toiletries", label: "Toiletries & Hygiene", icon: <SparklesIcon className="h-4 w-4" />, color: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300" },
  { key: "Electronics", label: "Electronics & Tech", icon: <Laptop className="h-4 w-4" />, color: "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300" },
  { key: "Documents", label: "Documents & Money", icon: <FileText className="h-4 w-4" />, color: "border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-300" },
  { key: "Custom", label: "Custom / Miscellaneous", icon: <Tag className="h-4 w-4" />, color: "border-slate-500 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300" },
];

const SMART_PRESETS: Record<string, { label: string; items: Omit<PackingItem, "id" | "checked">[] }> = {
  beach: {
    label: "🏖️ Tropical & Beach Resort",
    items: [
      { text: "Reef-safe Sunscreen SPF 50", category: "Toiletries" },
      { text: "Swimwear (2-3 pairs) & Rash guard", category: "Clothing" },
      { text: "Sunglasses & Wide-brim sun hat", category: "Clothing" },
      { text: "Flip-flops / Sandals & Water shoes", category: "Clothing" },
      { text: "After-sun Aloe Vera gel", category: "Toiletries" },
      { text: "Waterproof dry bag for beach", category: "Essentials" },
      { text: "Passport & Travel insurance copy", category: "Documents" },
      { text: "Portable power bank & adapter", category: "Electronics" },
    ],
  },
  city: {
    label: "🏙️ Urban & European City Walk",
    items: [
      { text: "Comfortable walking sneakers / boots", category: "Clothing" },
      { text: "Versatile light layers & cardigan", category: "Clothing" },
      { text: "Compact travel umbrella", category: "Essentials" },
      { text: "Crossbody anti-theft daypack", category: "Essentials" },
      { text: "Universal plug adapter & fast charger", category: "Electronics" },
      { text: "Noise-cancelling headphones for flight", category: "Electronics" },
      { text: "Passport, credit cards & local cash", category: "Documents" },
      { text: "Blister cushions / Mini first-aid kit", category: "Toiletries" },
    ],
  },
  winter: {
    label: "⛷️ Cold Weather & Ski Adventure",
    items: [
      { text: "Thermal base layers (merino wool)", category: "Clothing" },
      { text: "Insulated waterproof winter coat", category: "Clothing" },
      { text: "Warm beanie, wool socks & gloves", category: "Clothing" },
      { text: "Lip balm with SPF & intense moisturizer", category: "Toiletries" },
      { text: "Hand & toe warmers", category: "Essentials" },
      { text: "Ski goggles & neck gaiter", category: "Clothing" },
      { text: "Passport & health insurance card", category: "Documents" },
      { text: "High-capacity power bank (cold drains battery)", category: "Electronics" },
    ],
  },
};

export default function PackingChecklistPage() {
  const [lists, setLists] = useState<PackingChecklist[]>([]);
  const [activeList, setActiveList] = useState<PackingChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form input states
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});
  const [presetType, setPresetType] = useState<string>("city");

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checklists");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setLists(data.data);
        setActiveList(data.data[0]);
      } else {
        // Create initial default list
        const defaultList: PackingChecklist = {
          tripName: "My Dream Vacation Checklist",
          destination: "Tokyo & Kyoto",
          items: [
            { id: "item-1", text: "Passport (valid for 6+ months)", category: "Documents", checked: true },
            { id: "item-2", text: "Flight tickets & Hotel vouchers", category: "Documents", checked: true },
            { id: "item-3", text: "Universal power adapter", category: "Electronics", checked: false },
            { id: "item-4", text: "Comfortable walking shoes", category: "Clothing", checked: false },
            { id: "item-5", text: "Toothbrush, toothpaste & shampoo", category: "Toiletries", checked: false },
            { id: "item-6", text: "Power bank (10,000 mAh max for carry-on)", category: "Electronics", checked: false },
          ],
        };
        setActiveList(defaultList);
      }
    } catch (e) {
      toast.error("Failed to load packing lists");
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentList = async (updated: PackingChecklist) => {
    setActiveList(updated);
    setSaving(true);
    try {
      const res = await fetch("/api/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveList(data.data);
        setLists((prev) => {
          const index = prev.findIndex((l) => l._id === data.data._id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = data.data;
            return next;
          }
          return [data.data, ...prev];
        });
        toast.success("Checklist saved!");
        triggerSuccessBurst();
      }
    } catch (e) {
      toast.error("Error saving checklist");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCheck = (id: string) => {
    if (!activeList) return;
    const updatedItems = activeList.items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it));
    const updated = {
      ...activeList,
      items: updatedItems,
    };
    if (updatedItems.length > 0 && updatedItems.every((it) => it.checked)) {
      triggerChecklistComplete();
      toast.success("🎉 All items packed! You are ready for adventure!");
    }
    saveCurrentList(updated);
  };

  const handleAddItem = (category: PackingItem["category"]) => {
    const text = newItemTexts[category]?.trim();
    if (!text || !activeList) return;

    const newItem: PackingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      text,
      category,
      checked: false,
    };

    const updated = {
      ...activeList,
      items: [...activeList.items, newItem],
    };

    setNewItemTexts((prev) => ({ ...prev, [category]: "" }));
    saveCurrentList(updated);
  };

  const handleDeleteItem = (id: string) => {
    if (!activeList) return;
    const updated = {
      ...activeList,
      items: activeList.items.filter((it) => it.id !== id),
    };
    saveCurrentList(updated);
  };

  const handleApplySmartPreset = () => {
    if (!activeList || !SMART_PRESETS[presetType]) return;
    const presetItems = SMART_PRESETS[presetType].items.map((it) => ({
      ...it,
      id: `smart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      checked: false,
    }));

    const updated = {
      ...activeList,
      items: [...activeList.items, ...presetItems],
    };
    saveCurrentList(updated);
    toast.success(`Populated ${presetItems.length} smart items for ${SMART_PRESETS[presetType].label}!`);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading packing lists...</p>
        </div>
      </div>
    );
  }

  if (!activeList) return null;

  const totalItems = activeList.items.length;
  const packedItems = activeList.items.filter((it) => it.checked).length;
  const progressPct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/20 text-white">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Smart Packing Checklists</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Never forget essentials. Track your packing progress and auto-seed lists by destination weather
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => saveCurrentList(activeList)}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 text-xs h-9 font-semibold"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving..." : "Save Checklist"}
          </Button>
        </div>
      </div>

      {/* Progress Card & Smart AI Preset Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bar Card */}
        <Card className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeList.tripName}</h3>
              <p className="text-xs text-slate-500">{activeList.destination}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{progressPct}%</span>
              <span className="text-xs font-semibold text-slate-500">
                ({packedItems} of {totalItems} packed)
              </span>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </Card>

        {/* AI Smart Preset Generator Card */}
        <Card className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <Sparkles className="h-4 w-4 text-emerald-600" /> AI Smart List Populator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Instantly append tailored items based on your travel environment:
            </p>
            <select
              value={presetType}
              onChange={(e) => setPresetType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3"
            >
              {Object.entries(SMART_PRESETS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleApplySmartPreset}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 text-xs font-semibold gap-1.5 shadow-sm shadow-emerald-600/20"
          >
            <Plus className="h-3.5 w-3.5" /> Populate Checklist
          </Button>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const catItems = activeList.items.filter((it) => it.category === cat.key);
          const packedCatCount = catItems.filter((it) => it.checked).length;

          return (
            <Card
              key={cat.key}
              className={`rounded-2xl border-t-4 shadow-sm bg-white dark:bg-slate-900 flex flex-col justify-between ${cat.color.split(" ")[0]}`}
            >
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${cat.color.split(" ").slice(1).join(" ")}`}>{cat.icon}</div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">{cat.label}</CardTitle>
                </div>
                <span className="text-[11px] font-extrabold text-slate-400">
                  {packedCatCount}/{catItems.length}
                </span>
              </CardHeader>

              <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {catItems.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No items in this category.</p>
                  ) : (
                    catItems.map((item) => (
                      <div
                        key={item.id}
                        className={`group flex items-center justify-between p-2 rounded-xl transition-colors ${
                          item.checked
                            ? "bg-slate-50/80 dark:bg-slate-800/40 text-slate-400 line-through"
                            : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleCheck(item.id)}
                          className="flex items-center gap-2.5 text-left flex-1 text-xs font-medium cursor-pointer"
                        >
                          {item.checked ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                          <span>{item.text}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-opacity"
                          title="Delete item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add Input */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Input
                    placeholder="Add item..."
                    value={newItemTexts[cat.key] || ""}
                    onChange={(e) => setNewItemTexts((prev) => ({ ...prev, [cat.key]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddItem(cat.key);
                      }
                    }}
                    className="h-8 rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddItem(cat.key)}
                    className="h-8 w-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white p-0 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
