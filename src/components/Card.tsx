"use client";
import React from "react";
import Image from "next/image";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
interface PlaceCardProps {
  title: string;
  imageUrl: string;
  placeHistory: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  title,
  imageUrl,
  placeHistory,
}) => {
  const router = useRouter();

  const handleClick = (e: any) => {
    // on handle clickl it should open map page zoomed into that location
    // console.log("clicked : ", e.target);
    const imageBtn = e.target;
    // redirect to map page with the location

    const destinationName = imageBtn.alt;

    const url = `/map/${imageBtn.alt}`;

    // router
    router.push(url);
  };
  return (
    <div
      className="bg-[#f4fff9] rounded-lg shadow-md overflow-hidden"
      onClick={handleClick}
    >
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={200}
        className="w-full h-32 sm:h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-black text-lg font-semibold">{title}</h3>
        <p className="text-gray-900 ">{placeHistory}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
