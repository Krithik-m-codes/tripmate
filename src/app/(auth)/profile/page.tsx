"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LogOut,
  Mail,
  User,
  CheckCircle,
  XCircle,
  MapPin,
  Loader2,
} from "lucide-react";

interface ProfileData {
  savedPlaces: any[];
  data: any;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      if (session?.user?._id) {
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProfileData(data);
      }
    };
    getProfile();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#166F5B]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center bg-bg-sign-up bg-center bg-cover justify-center min-h-screen bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-[350px] shadow-lg">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center mb-4">
                Not Signed In
              </h2>
              <p className="text-center mb-6 text-gray-600">
                You need to be signed in to access this page
              </p>
              <Button
                className="w-full bg-[#166F5B] text-white hover:bg-[#0d4d3d] transition-colors duration-300"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const SavedPlaces = profileData?.data?.savedPlaces;
  const lengthSavedPlaces = SavedPlaces?.length ?? 0;
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "No email provided";
  const isVerified = session?.user?.isVerified ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-green-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#166F5B] text-white py-6 shadow-md"
      >
        <h1 className="text-3xl font-bold text-center">My Profile</h1>
      </motion.div>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-teal-500 to-green-400 h-32 relative">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute -bottom-16 inset-x-0 flex justify-center"
              >
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={`https://eu.ui-avatars.com/api/?name=${userName}&background=random`}
                    alt={userName}
                  />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
            <CardContent className="pt-20 pb-8 px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {userName}
                </h2>
                <p className="text-xl text-gray-500 mb-3">{userEmail}</p>
                {isVerified ? (
                  <Badge
                    variant="default"
                    className="gap-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Email Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-4 w-4" />
                    Email Not Verified
                  </Badge>
                )}
              </motion.div>
              <Separator className="my-8" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-[#166F5B] mr-3" />
                  <span className="text-gray-700">{userEmail}</span>
                </div>
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <User className="h-5 w-5 text-[#166F5B] mr-3" />
                  <span className="text-gray-700">
                    @{userName.toLowerCase().replace(" ", "")}
                  </span>
                </div>
                <div className="flex items-center bg-gray-100 p-3 rounded-lg col-span-full">
                  <MapPin className="h-5 w-5 text-[#166F5B] mr-3" />
                  <span className="text-gray-700">
                    {profileData
                      ? `${lengthSavedPlaces} Saved Places in favorites`
                      : "Loading saved places..."}
                  </span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <Button
            variant="destructive"
            onClick={() => signOut()}
            className="gap-2 bg-red-500 hover:bg-red-600 transition-colors duration-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
