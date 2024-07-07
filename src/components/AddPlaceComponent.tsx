import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddPlaceForm = ({ onPlaceAdded }: { onPlaceAdded: () => void }) => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user._id) {
      alert("You must be logged in to add a place.");
      return;
    }

    try {
      const response = await fetch("/api/saved-places/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user._id,
          name,
          location,
          description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Place added successfully!");
        setName("");
        setLocation("");
        setDescription("");
        onPlaceAdded();
      } else {
        alert("Failed to add place. Please try again.");
      }
    } catch (error) {
      console.error("Error adding place:", error);
      alert("An error occurred while adding the place.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Place Name"
        required
      />
      <Input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <Button type="submit">Add Place</Button>
    </form>
  );
};

export default AddPlaceForm;
