"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchImages } from "@/app/api/index";

interface FavoritePlace {
  name: string;
  location: string;
  message: string;
}

const FavoritePlaceCard: React.FC<FavoritePlace> = ({
  name,
  location,
  message,
}) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetchImages(name.toString());
      console.log(response[0]);
      if (response) {
        setImageUrl(response[0].largeImageURL);
        console.log(
          "response in FavoritePlaceCard : ",
          response[0].largeImageURL
        );
      }
    };

    fetchImage();
  }, [name]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-auto w-1/2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-500">{location}</p>
      </div>
      <p className="text-gray-700">{message}</p>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          className="mt-4 rounded-lg w-full h-48 object-cover"
          width={1920}
          height={1080}
        />
      )}
    </div>
  );
};

export default FavoritePlaceCard;
