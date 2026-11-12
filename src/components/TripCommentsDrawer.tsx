"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export interface TripCommentItem {
  _id: string;
  itineraryId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetType: "itinerary" | "day" | "activity";
  targetId: string;
  content: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TripCommentsDrawerProps {
  itineraryId: string;
  isOpen: boolean;
  onClose: () => void;
  /** Optional pre-selected targetId (e.g. when clicked from a specific activity badge) */
  initialTargetId?: string;
  initialTargetType?: "itinerary" | "day" | "activity";
  /** Optional map of activity/day IDs to human readable labels */
  targetLabels?: Record<string, string>;
  currentUserId?: string;
}

export function TripCommentsDrawer({
  itineraryId,
  isOpen,
  onClose,
  initialTargetId = "all",
  initialTargetType = "itinerary",
  targetLabels = {},
  currentUserId,
}: TripCommentsDrawerProps) {
  const [comments, setComments] = useState<TripCommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterTarget, setFilterTarget] = useState<string>(initialTargetId);
  const [filterResolved, setFilterResolved] = useState<"all" | "open" | "resolved">("all");

  // New comment state
  const [newContent, setNewContent] = useState("");
  const [newTargetType, setNewTargetType] = useState<"itinerary" | "day" | "activity">(
    initialTargetId !== "all" && initialTargetId !== "general"
      ? initialTargetType
      : "itinerary"
  );
  const [newTargetId, setNewTargetId] = useState<string>(
    initialTargetId !== "all" ? initialTargetId : "general"
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && itineraryId) {
      fetchComments();
      if (initialTargetId && initialTargetId !== "all") {
        setFilterTarget(initialTargetId);
        setNewTargetId(initialTargetId);
        setNewTargetType(initialTargetType);
      }
    }
  }, [isOpen, itineraryId, initialTargetId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/itineraries/${itineraryId}/comments`);
      if (res.data?.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
      toast.error("Failed to load discussion notes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      toast.error("Please enter note content");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        targetType: newTargetType,
        targetId: newTargetId,
        content: newContent.trim(),
      };
      const res = await axios.post(`/api/itineraries/${itineraryId}/comments`, payload);
      if (res.data?.success) {
        toast.success("Note added!");
        setNewContent("");
        fetchComments();
      }
    } catch (err: any) {
      console.error("Failed to add note:", err);
      toast.error(err.response?.data?.message || "Failed to submit note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleResolve = async (comment: TripCommentItem) => {
    try {
      const res = await axios.patch(
        `/api/itineraries/${itineraryId}/comments/${comment._id}`,
        { isResolved: !comment.isResolved }
      );
      if (res.data?.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === comment._id ? { ...c, isResolved: !comment.isResolved } : c
          )
        );
        toast.info(
          !comment.isResolved ? "Marked as resolved ✓" : "Reopened note"
        );
      }
    } catch (err) {
      console.error("Failed to toggle resolve:", err);
      toast.error("Could not update status");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await axios.delete(`/api/itineraries/${itineraryId}/comments/${commentId}`);
      if (res.data?.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.success("Note removed");
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
      toast.error("Failed to delete note");
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filterTarget !== "all" && c.targetId !== filterTarget) return false;
    if (filterResolved === "open" && c.isResolved) return false;
    if (filterResolved === "resolved" && !c.isResolved) return false;
    return true;
  });

  const getTargetLabel = (c: TripCommentItem) => {
    if (c.targetId === "general" || c.targetType === "itinerary") return "🌐 General Trip Note";
    if (targetLabels[c.targetId]) return `📍 ${targetLabels[c.targetId]}`;
    return `📌 ${c.targetId}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Slide over drawer panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-bold text-base sm:text-lg bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Trip Notes & Discussions
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Collaborate, leave tips, and track activity questions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filter controls */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setFilterTarget("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterTarget === "all"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  All Notes ({comments.length})
                </button>
                {initialTargetId !== "all" && initialTargetId !== "general" && (
                  <button
                    onClick={() => setFilterTarget(initialTargetId)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                      filterTarget === initialTargetId
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>📍 Selected Activity</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 self-end sm:self-center">
                <button
                  onClick={() => setFilterResolved("all")}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    filterResolved === "all" ? "bg-slate-800 text-emerald-300" : "text-slate-400"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterResolved("open")}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    filterResolved === "open" ? "bg-slate-800 text-amber-300" : "text-slate-400"
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilterResolved("resolved")}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    filterResolved === "resolved" ? "bg-slate-800 text-emerald-400" : "text-slate-400"
                  }`}
                >
                  Resolved ✓
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-28 bg-slate-800/60 rounded-2xl" />
                  ))}
                </div>
              ) : filteredComments.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                  <span className="text-4xl block">📝</span>
                  <h4 className="font-semibold text-sm text-slate-300">No notes found</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {filterTarget !== "all" || filterResolved !== "all"
                      ? "No notes match the selected filters."
                      : "Start the conversation! Leave a note about reservation details, ideas, or questions for your trip."}
                  </p>
                </div>
              ) : (
                filteredComments.map((comment) => {
                  const isOwnerOrAuthor =
                    currentUserId && (comment.userId === currentUserId || !currentUserId); // if currentUserId passed check, otherwise allow toggle/delete actions
                  return (
                    <div
                      key={comment._id}
                      className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                        comment.isResolved
                          ? "bg-slate-950/40 border-slate-800/60 opacity-75"
                          : "bg-slate-900/80 border-slate-800 shadow-md hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-sm">
                            {comment.userAvatar ? (
                              <img
                                src={comment.userAvatar}
                                alt={comment.userName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              comment.userName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-200 block">
                              {comment.userName}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-[10px] font-medium text-slate-300">
                          {getTargetLabel(comment)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line pl-1">
                        {comment.content}
                      </p>

                      <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleResolve(comment)}
                          className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                            comment.isResolved
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                          }`}
                        >
                          <span>{comment.isResolved ? "✓ Resolved" : "⭕ Mark Resolved"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          title="Delete note"
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Note Form */}
            <form
              onSubmit={handleAddComment}
              className="p-4 border-t border-slate-800 bg-slate-950 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">New Note / Tip</span>
                <select
                  value={newTargetType}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setNewTargetType(t);
                    if (t === "itinerary") setNewTargetId("general");
                    else if (initialTargetId && initialTargetId !== "all") setNewTargetId(initialTargetId);
                    else setNewTargetId("day-1");
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-lg text-[11px] px-2 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="itinerary">🌐 General Note</option>
                  <option value="activity">📍 Specific Activity</option>
                  <option value="day">🗓️ Day Note</option>
                </select>
              </div>

              {newTargetType !== "itinerary" && (
                <input
                  type="text"
                  value={newTargetId}
                  onChange={(e) => setNewTargetId(e.target.value)}
                  placeholder="e.g. day-1-act-0 or Day 1"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              )}

              <div className="relative">
                <textarea
                  rows={2}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write a note, question, confirmation code, or pro-tip..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none pr-20"
                />
                <button
                  type="submit"
                  disabled={submitting || !newContent.trim()}
                  className="absolute right-2 bottom-2 px-3.5 py-1.5 rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40"
                >
                  {submitting ? "..." : "Post"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
