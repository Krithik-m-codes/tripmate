"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, Mail, User, CheckCircle, XCircle, MapPin } from "lucide-react";

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

  // console.log("Profile Data : ", profileData);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center bg-bg-sign-up bg-center bg-cover justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Not Signed In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              You need to be signed in to access this page
            </p>
            <Button
              className="w-full bg-[#166F5B] text-white"
              onClick={() => router.push("/sign-in")}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const SavedPlaces = profileData?.data?.savedPlaces;
  const lengthSavedPlaces = SavedPlaces?.length ?? 0;
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "No email provided";
  const isVerified = session?.user?.isVerified ?? false;

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl w-full bg-[#166F5B] text-center text-white py-4">
        My Profile
      </h1>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-green-400 h-32" />
          <div className="relative">
            <Avatar className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-32 w-32 border-4 border-white">
              <AvatarImage
                src={`https://eu.ui-avatars.com/api/?name=${userName}`}
                alt={userName}
              />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <CardContent className="pt-16 pb-8 px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">{userName}</h2>
              <p className="text-xl text-gray-500">{userEmail}</p>
              <div className="mt-2">
                {isVerified ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-4 w-4 bg-[#166F5B] text-white" />
                    Email Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-4 w-4 bg-[#166F5B] text-white" />
                    Email Not Verified
                  </Badge>
                )}
              </div>
            </div>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">{userEmail}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  @{userName.toLowerCase().replace(" ", "")}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {profileData
                    ? `${lengthSavedPlaces} Saved Places in favorites`
                    : "Loading..."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Button
            variant="destructive"
            onClick={() => signOut()}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
