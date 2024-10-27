// src/app/recent-itineraries/page.tsx
"use client";
import React from 'react';
import Component from '@/components/ItineraryCard';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';


const RecentItinerariesPage = () => {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [recentItinerary, setRecentItinerary] = useState<
        {
            itinerary: string[];
            destination: string;
            days: Object;
            activities: string[];
            budget: string;
            travelStyle: string;
            createdAt: string;
        }[]
    >([]);

    useEffect(() => {
        dbConnect();
        const fetchRecentHistory = async () => {
            try {
                const response = await fetch(
                    `/api/itinerary/${session?.user._id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();
                if (data.success) {
                    setRecentItinerary(data.data);
                } else {
                    console.error("Failed to fetch recent Generated Itineraries");
                }
            } catch (error) {
                console.error("Error fetching recent itineraries : ", error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user._id) {
            fetchRecentHistory();
        }
    }, [session?.user._id]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Recent AI-Generated Itineraries</h1>

            {/* <div className='grid grid-cols-3 gap-20 w-full '>
                <Component travelDetails={travelDetails} />
                <Component travelDetails={travelDetails} />
                <Component travelDetails={travelDetails} />
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 lg:gap-20">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : recentItinerary.length === 0 ? (
                    <div className="text-center">No recent itineraries found</div>
                ) : (
                    recentItinerary.map((itinerary, index) => (
                        <Component key={index} travelDetails={itinerary} />
                    ))
                )}
            </div>

        </div>
    );
};

export default RecentItinerariesPage;
