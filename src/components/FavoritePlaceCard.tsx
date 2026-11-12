"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchImages } from "@/app/api/index";
import { Trash2, MapPin } from "lucide-react";

interface FavoritePlace {
  _id?: string;
  name: string;
  location: string;
  message: string;
  category?: string;
  onDelete?: (id: string) => void;
}

const FavoritePlaceCard: React.FC<FavoritePlace> = ({
  _id,
  name,
  location,
  message,
  category = "Must Visit",
  onDelete,
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden h-full flex flex-col transition-all hover:shadow-xl hover:border-emerald-500/50"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full"
            />
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105 object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs">
            No image available
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="badge-active !text-[11px] !py-0.5 !px-2.5 shadow-sm">{category}</span>
        </div>
        {_id && onDelete && (
          <button
            onClick={() => onDelete(_id)}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-sm transition-colors shadow-sm"
            title="Remove saved place"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {name}
            </h2>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoritePlaceCard;
