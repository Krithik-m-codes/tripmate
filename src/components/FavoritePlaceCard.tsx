"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const response = await fetchImages(name);
        if (response && response.length > 0) {
          setImageUrl(response[0].largeImageURL);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden h-full"
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
            {name}
          </h2>
          <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {location}
          </p>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-4">{message}</p>
      </div>
      <div className="relative h-48 w-full">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 ease-in-out object-cover object-center"
            onLoadingComplete={(image) => image.classList.remove("opacity-0")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
            No image available
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FavoritePlaceCard;
