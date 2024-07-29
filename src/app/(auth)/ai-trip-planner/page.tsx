"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TripPlanner = () => {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [preferences, setPreferences] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [generatedItinerary, setGeneratedItinerary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateItinerary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-trip-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          duration,
          preferences,
          budget,
          travelStyle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate itinerary");
      }

      const data = await response.json();
      // console.log("Generated itinerary:", data);
      setGeneratedItinerary(data.data);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setGeneratedItinerary("Failed to generate itinerary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 p-4">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Generate Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <Input
              placeholder="Duration (e.g., 5 days)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Textarea
              placeholder="Preferences (e.g., museums, outdoor activities)"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid-range">Mid-range</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
            <Select value={travelStyle} onValueChange={setTravelStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateItinerary} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Itinerary"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Generated Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-black h-screen overflow-scroll">
            {generatedItinerary || "No itinerary generated yet."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripPlanner;
