"use client";
import { signOut, useSession } from "@/lib/authClient";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Mail, User, CheckCircle, XCircle, MapPin, Loader2, Edit3, Check, Globe, DollarSign, Bell } from "lucide-react";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: profileResponse, isLoading: isProfileLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    defaultCurrency: "USD",
    defaultTravelStyle: "Relaxed",
    language: "en",
    notifications: true,
  });

  useEffect(() => {
    if (profileResponse?.data?.preferences) {
      setPreferences({
        defaultCurrency: profileResponse.data.preferences.defaultCurrency || "USD",
        defaultTravelStyle: profileResponse.data.preferences.defaultTravelStyle || "Relaxed",
        language: profileResponse.data.preferences.language || "en",
        notifications: profileResponse.data.preferences.notifications !== false,
      });
    }
  }, [profileResponse]);

  const handleSavePreferences = async () => {
    try {
      await updateProfile({ preferences }).unwrap();
      toast.success("Preferences updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (e: any) {
      toast.error("Failed to update preferences");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50 dark:bg-slate-950">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="w-80 shadow-lg dark:bg-slate-900 border dark:border-slate-800">
            <CardContent className="pt-6 text-center">
              <h2 className="mb-2 text-xl font-bold text-slate-800 dark:text-white">Not signed in</h2>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                You need to be signed in to view your profile.
              </p>
              <Button
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => router.push("/sign-in")}
              >
                Sign in
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const userProfile = profileResponse?.data;
  const savedCount = (userProfile?.savedPlaces as any)?.length ?? 0;
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "No email provided";
  const isVerified = session?.user?.isVerified ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-emerald-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-6 py-5 shadow-sm"
      >
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Profile & Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account, travel preferences, and workspace settings</p>
      </motion.div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-card overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Cover gradient */}
            <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                {isEditing ? "Close Editor" : "Edit Preferences"}
              </button>
            </div>

            {/* Avatar */}
            <div className="relative -mt-16 flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-xl">
                <AvatarImage
                  src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=059669&color=fff`}
                  alt={userName}
                />
                <AvatarFallback className="bg-emerald-600 text-3xl font-bold text-white">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <CardContent className="pb-8 pt-4 px-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{userName}</h2>
                <p className="text-slate-500 dark:text-slate-400">{userEmail}</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {isVerified ? (
                    <Badge className="gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verified Traveler
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      Not verified
                    </Badge>
                  )}
                  <Badge className="gap-1 bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-teal-800">
                    Pro Plan Active
                  </Badge>
                </div>
              </div>

              <Separator className="my-6 dark:bg-slate-800" />

              {isEditing ? (
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base border-b dark:border-slate-800 pb-2">
                    Customize Travel Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> Default Currency
                      </label>
                      <select
                        value={preferences.defaultCurrency}
                        onChange={(e) => setPreferences({ ...preferences, defaultCurrency: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="AUD">AUD ($)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> Default Travel Style
                      </label>
                      <select
                        value={preferences.defaultTravelStyle}
                        onChange={(e) => setPreferences({ ...preferences, defaultTravelStyle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                      >
                        <option value="Relaxed">Relaxed & Casual</option>
                        <option value="Adventure">Adventure & Outdoors</option>
                        <option value="Luxury">Luxury & Comfort</option>
                        <option value="Fast-Paced">Fast-Paced Explorer</option>
                        <option value="Cultural">Cultural Immersion</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Email Trip Summaries & Alerts via Brevo
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                      className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl border-slate-200 dark:border-slate-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSavePreferences}
                      disabled={isUpdating}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-1.5" />}
                      Save Preferences
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Info rows */}
                  {isProfileLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</span>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{userEmail}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Traveler Handle</span>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          @{userName.toLowerCase().replace(/\s+/g, "")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Saved Places Collection</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {savedCount} {savedCount === 1 ? "place" : "places"} bookmarked
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Preferred Travel Style</span>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                          {preferences.defaultTravelStyle} ({preferences.defaultCurrency})
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="mt-8 flex justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
                <Button
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out of TripMate
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
