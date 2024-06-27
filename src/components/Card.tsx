// src/components/Card.tsx
import React from "react";
import Image from "next/image";
import StarRating from "./StarRating";

type CardProps = {
  title: string;
  address: string;
  imageSrc: string;
  rating?: number;
};

const Card: React.FC<CardProps> = ({
  title,
  address,
  imageSrc,
  rating = 0,
}) => {
  return (
    <a href="#" className="block rounded-lg p-4 shadow-sm shadow-indigo-100">
      {/* for showing image in card */}
      <Image
        alt=""
        src={imageSrc}
        width={640}
        height={320}
        className="h-56 w-full rounded-md object-cover"
      />
      {/* for showing details in card */}
      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">Name</dt>

            <dd className="text-sm text-gray-500">{title}</dd>
          </div>

          <div>
            <dt className="sr-only">Address</dt>

            <dd className="font-medium">{address}</dd>
          </div>
        </dl>
        {/* For rating display in card */}
        <div className="mt-4">
          <div className="flex items-center">
            <StarRating rating={rating} />
          </div>
        </div>
      </div>
    </a>
  );
};

export default Card;
