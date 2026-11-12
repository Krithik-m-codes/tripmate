"use client";
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  MapPin,
  Calendar,
  Wallet,
  Wind,
  ChevronDown,
  Zap,
  BookOpen,
  Save,
  Copy,
  Check,
  RefreshCw,
  Info,
  Send,
  User,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import DatePickerWithRange from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { useSession } from "@/lib/authClient";
import PDFDownloadButton from "@/components/PDFDownloadButton";
import WeatherWidget from "@/components/WeatherWidget";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedModel,
  setGenerating,
  setGeneratedItinerary,
  appendItineraryChunk,
  clearItinerary,
  setError,
  toggleRAG,
  AI_MODELS,
  type AIModel,
} from "@/store/slices/aiSlice";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import { triggerTripCelebration, triggerSuccessBurst } from "@/lib/confetti";

const PROVIDER_COLORS: Record<string, string> = {
  gemini: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  "nvidia-nim": "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  openrouter: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
};

const PROVIDER_LABELS: Record<string, string> = {
  gemini: "Google Gemini",
  "nvidia-nim": "NVIDIA NIM",
  openrouter: "OpenRouter",
};

// ─── Status Messages for streaming ────────────────────────────────────────────
const STATUS_MESSAGES = [
  "Scouting the best spots…",
  "Mapping out your adventure…",
  "Finding hidden gems…",
  "Calculating costs…",
  "Adding local recommendations…",
  "Crafting your perfect day…",
  "Polishing the details…",
];

function useRotatingStatus(active: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [active]);
  return active ? STATUS_MESSAGES[index] : "";
}

// ─── Model selector ───────────────────────────────────────────────────────────
function ModelSelector() {
  const dispatch = useAppDispatch();
  const { selectedModel, isGenerating } = useAppSelector((s) => s.ai);
  const [open, setOpen] = useState(false);

  const grouped = AI_MODELS.reduce<Record<string, AIModel[]>>((acc, m) => {
    (acc[m.provider] = acc[m.provider] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="relative">
      <button
        disabled={isGenerating}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-emerald-300 dark:hover:border-emerald-700 disabled:opacity-50"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold shrink-0",
              PROVIDER_COLORS[selectedModel.provider]
            )}
          >
            {PROVIDER_LABELS[selectedModel.provider]}
          </span>
          <span className="truncate text-xs">{selectedModel.label}</span>
        </div>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl"
          >
            {Object.entries(grouped).map(([provider, models]) => (
              <div key={provider}>
                <p className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {PROVIDER_LABELS[provider]}
                </p>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      dispatch(setSelectedModel(m));
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors",
                      selectedModel.id === m.id && "bg-emerald-50 dark:bg-slate-700"
                    )}
                  >
                    <Zap
                      className={cn(
                        "mt-0.5 h-3.5 w-3.5 shrink-0",
                        selectedModel.id === m.id
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-300 dark:text-slate-600"
                      )}
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-100">{m.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Quick Setup Panel ────────────────────────────────────────────────────────
function QuickSetupPanel({
  onGenerate,
}: {
  onGenerate: (message: string) => void;
}) {
  const dispatch = useAppDispatch();
  const { selectedModel, isGenerating, useRAG } = useAppSelector((s) => s.ai);
  const [destination, setDestination] = useState("");
  const [preferences, setPreferences] = useState("");
  const [budget, setBudget] = useState("mid-range");
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [date, setDate] = useState<DateRange | undefined>();
  const [collapsed, setCollapsed] = useState(false);

  const BUDGET_OPTIONS = [
    { value: "budget", label: "Budget", emoji: "🎒" },
    { value: "mid-range", label: "Mid-range", emoji: "✈️" },
    { value: "luxury", label: "Luxury", emoji: "💎" },
  ];

  const STYLE_OPTIONS = [
    { value: "relaxed", label: "Relaxed", emoji: "🌅" },
    { value: "balanced", label: "Balanced", emoji: "⚖️" },
    { value: "active", label: "Active", emoji: "🏃" },
    { value: "cultural", label: "Cultural", emoji: "🏛️" },
    { value: "foodie", label: "Foodie", emoji: "🍜" },
  ];

  const handleSubmit = () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination.");
      return;
    }
    if (!date?.from || !date?.to) {
      toast.error("Please select travel dates.");
      return;
    }

    const dateFrom = date.from.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const dateTo = date.to.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const message = `Plan a ${travelStyle} trip to ${destination} from ${dateFrom} to ${dateTo} on a ${budget} budget.${
      preferences ? ` My interests: ${preferences}.` : ""
    }`;

    onGenerate(message);
    setCollapsed(true);
  };

  return (
    <div className="border-b border-slate-100 dark:border-slate-800">
      {/* Toggle header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Quick Setup
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-400 transition-transform",
            collapsed && "-rotate-90"
          )}
        />
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-4 pb-4">
              {/* Model selector */}
              <ModelSelector />

              {/* RAG toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">RAG Enhancement</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Injects curated travel knowledge</p>
                </div>
                <button
                  onClick={() => dispatch(toggleRAG())}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    useRAG ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-600"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                      useRAG ? "translate-x-4" : "translate-x-0.5"
                    )}
                  />
                </button>
              </label>

              {/* Destination */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3 w-3 text-emerald-500" />
                  Destination
                </label>
                <Input
                  placeholder="e.g. Kyoto, Japan"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-9 text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-emerald-400"
                />
              </div>

              {/* Date range */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3 w-3 text-emerald-500" />
                  Travel Dates
                </label>
                <DatePickerWithRange date={date} setDate={setDate} />
              </div>

              {/* Budget chips */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Wallet className="h-3 w-3 text-emerald-500" />
                  Budget
                </label>
                <div className="flex gap-1.5">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBudget(opt.value)}
                      className={cn(
                        "flex-1 rounded-lg border py-1.5 text-[11px] font-semibold transition-all",
                        budget === opt.value
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200"
                      )}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel style chips */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Wind className="h-3 w-3 text-emerald-500" />
                  Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTravelStyle(opt.value)}
                      className={cn(
                        "rounded-lg border py-1.5 text-[11px] font-semibold transition-all",
                        travelStyle === opt.value
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200"
                      )}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3 w-3 text-emerald-500" />
                  Interests
                </label>
                <Textarea
                  placeholder="e.g. street food, photography, temples"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="resize-none text-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  rows={2}
                />
              </div>

              {/* Generate button */}
              <Button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-70"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Bot className="h-3.5 w-3.5" />
                    Generate Itinerary
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Chat Message Bubble ──────────────────────────────────────────────────────
function ChatBubble({
  role,
  content,
  isStreaming,
}: {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-slate-200 dark:bg-slate-700"
            : "bg-emerald-100 dark:bg-emerald-900"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
        ) : (
          <Bot className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-emerald-600 text-white rounded-tr-sm"
            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm"
        )}
      >
        {content ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : isStreaming ? (
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

// Helper to extract text from AI SDK v7 UIMessage or legacy message
function getMessageText(message: any): string {
  if (!message) return "";
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  return "";
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({
  messages,
  isLoading,
  sendMessage,
}: {
  messages: any[];
  isLoading: boolean;
  sendMessage: (message: any) => void;
}) {
  const { selectedModel, useRAG } = useAppSelector((s) => s.ai);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const statusMessage = useRotatingStatus(isLoading);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleQuickGenerate = (message: string) => {
    sendMessage({ text: message });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900">
      {/* Quick setup (collapsible) */}
      <QuickSetupPanel onGenerate={handleQuickGenerate} />

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950 mb-3">
              <MessageSquare className="h-7 w-7 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Chat with your AI travel planner
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Use the Quick Setup above for a full itinerary, or ask anything
              about your trip right here.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {[
                "Best time to visit Bali?",
                "3-day Tokyo itinerary",
                "Budget tips for Europe",
                "Hidden gems in Portugal",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message: any) => (
            <ChatBubble
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={getMessageText(message)}
              isStreaming={isLoading && message.id === messages[messages.length - 1]?.id}
            />
          ))
        )}

        {/* Streaming status */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-2 py-1"
          >
            <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {statusMessage}
            </span>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your trip or request changes…"
              rows={1}
              className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 pr-10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 transition-all"
              style={{ maxHeight: "120px" }}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="sm"
            className="h-10 w-10 shrink-0 rounded-xl bg-emerald-600 p-0 hover:bg-emerald-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <span>
            Powered by{" "}
            <span className={cn("font-semibold", PROVIDER_COLORS[selectedModel.provider])}>
              {selectedModel.label}
            </span>
            {useRAG && " + RAG"}
          </span>
          <span>Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}

// ─── Itinerary Output Panel ───────────────────────────────────────────────────
function ItineraryCanvas({ messages }: { messages: any[] }) {
  const { selectedModel } = useAppSelector((s) => s.ai);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"markdown" | "timeline">("markdown");

  // Find the latest assistant message that looks like an itinerary
  const latestItinerary = [...messages]
    .reverse()
    .find((m) => {
      const text = getMessageText(m);
      return m.role === "assistant" && text.length > 500 && /day\s*\d/i.test(text);
    });

  const latestText = latestItinerary ? getMessageText(latestItinerary) : "";

  const handleCopy = async () => {
    if (!latestText) return;
    await navigator.clipboard.writeText(latestText);
    setCopied(true);
    triggerSuccessBurst();
    setTimeout(() => setCopied(false), 2000);
  };

  const destinationMatch =
    latestText.match(/(?:for|to|destination:?|visit)\s+([A-Z][a-zA-Z\s,]+?)(?:\s+from|\s+on|\s+in|\n|\.|$)/i) ||
    messages.find((m) => m.role === "user")?.content?.match(/(?:to|visit|trip to)\s+([A-Z][a-zA-Z\s,]+?)(?:\s+from|\s+on|\s+in|\n|\.|$)/i);
  const extractedDestination = destinationMatch ? destinationMatch[1].trim() : "Your Trip";

  const handleSave = async () => {
    if (!latestText) return;
    setSaving(true);
    try {
      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: extractedDestination,
          itinerary: latestText,
          days: { from: new Date().toISOString(), to: new Date(Date.now() + 7 * 86400000).toISOString() },
          budget: "Moderate",
          travelStyle: "Exploration",
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerTripCelebration();
        toast.success("Itinerary saved to your trips! ✨");
      } else {
        toast.error(data.message || "Failed to save itinerary");
      }
    } catch (e) {
      toast.error("Error saving itinerary");
    } finally {
      setSaving(false);
    }
  };

  if (!latestItinerary || !latestText) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <Sparkles className="h-10 w-10 text-emerald-500" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Your itinerary will appear here
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Use the chat to generate or refine your trip plan.
            The latest itinerary will be displayed in this panel.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Day-by-day schedule</span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Cost estimates</span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Hidden gems</span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Local food picks</span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">Packing tips</span>
        </div>
      </div>
    );
  }

  // Format the itinerary text
  const lines = latestText.split("\n");

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Generated Itinerary
          </span>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("markdown")}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                viewMode === "markdown" ? "bg-emerald-600 text-white font-semibold shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                viewMode === "timeline" ? "bg-emerald-600 text-white font-semibold shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <PDFDownloadButton
            destination={extractedDestination}
            itineraryData={latestText}
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
          />
          <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 gap-1 text-xs">
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleSave} disabled={saving} className="h-7 gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold">
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Scrollable output */}
      <ScrollArea className="flex-1 p-5">
        <WeatherWidget destination={extractedDestination} className="mb-5" />
        {viewMode === "timeline" ? (
          <ItineraryTimeline itineraryData={latestText} destination={extractedDestination} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 space-y-1"
          >
            {lines.map((line: string, i: number) => {
              if (!line.trim()) return <div key={i} className="h-2" />;

              // Day headers
              if (/^#{1,3}\s*day\s+\d+/i.test(line.trim()) || /^day\s+\d+/i.test(line.trim())) {
                return (
                  <h2
                    key={i}
                    className="mt-6 border-l-4 border-emerald-500 pl-3 text-base font-bold text-emerald-800 dark:text-emerald-300 first:mt-0"
                  >
                    {line.replace(/^#+\s*/, "")}
                  </h2>
                );
              }
              // Section headers
              if (/^#{1,3}\s*(morning|afternoon|evening|accommodation|meals|transport|cost|highlight|tip|total|travel tips|what to pack|packing|budget|emergency)/i.test(line.trim()) ||
                  /^(morning|afternoon|evening|accommodation|meals|transport|cost|highlight|tip|total|travel tips|what to pack|packing|budget|emergency)/i.test(line.trim())) {
                return (
                  <h3 key={i} className="mt-3 font-semibold text-slate-800 dark:text-slate-100">
                    {line.replace(/^#+\s*/, "")}
                  </h3>
                );
              }
              // Bold lines
              if (/^\*\*/.test(line.trim())) {
                return (
                  <p key={i} className="font-semibold text-slate-800 dark:text-slate-100">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              // Dash list items
              if (line.trim().startsWith("- ")) {
                return (
                  <div key={i} className="flex gap-2 py-0.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{line.trim().slice(2)}</span>
                  </div>
                );
              }
              // Numbered list items
              if (/^\d+\.\s/.test(line.trim())) {
                return (
                  <div key={i} className="flex gap-2 py-0.5 pl-1">
                    <span className="shrink-0 font-semibold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5 min-w-[1.25rem]">
                      {line.trim().match(/^\d+/)?.[0]}.
                    </span>
                    <span>{line.trim().replace(/^\d+\.\s*/, "")}</span>
                  </div>
                );
              }
              return <p key={i}>{line}</p>;
            })}
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TripPlanner = () => {
  const [showCanvas, setShowCanvas] = useState(true);
  const { selectedModel, useRAG } = useAppSelector((s) => s.ai);

  const { messages, status, sendMessage } = useChat({
    id: "trip-planner",
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: {
        provider: selectedModel.provider,
        model: selectedModel.id,
        useRAG,
      },
    }),
    onFinish: () => {
      triggerTripCelebration();
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-900">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700 dark:bg-emerald-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">AI Trip Planner</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Bespoke day-by-day travel curation
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCanvas(!showCanvas)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors md:hidden"
        >
          {showCanvas ? (
            <>
              <PanelLeftClose className="h-3.5 w-3.5" />
              Chat
            </>
          ) : (
            <>
              <PanelLeftOpen className="h-3.5 w-3.5" />
              Itinerary
            </>
          )}
        </button>
      </div>

      {/* Split panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div
          className={cn(
            "flex flex-col overflow-hidden border-r border-slate-100 dark:border-slate-800",
            showCanvas ? "hidden md:flex md:w-2/5 lg:w-[420px]" : "w-full md:flex md:w-2/5 lg:w-[420px]"
          )}
        >
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            sendMessage={sendMessage}
          />
        </div>

        {/* Itinerary canvas */}
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900",
            !showCanvas ? "hidden md:flex" : "flex"
          )}
        >
          <ItineraryCanvas messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
