"use client";
import React, { useState } from "react";
import { Marker } from "react-map-gl";
import { motion } from "framer-motion";
import Image from "next/image";

interface Place {
    location_id: string;
    name: string;
    latitude: string;
    longitude: string;
    address_obj: {
        street1: string;
        city: string;
        state: string;
        country: string;
    };
    phone: string;
    num_reviews: string;
    web_url: string;
    [key: string]: any; // Include any other fields that might be present in the API data
}

interface MarkerProps {
    place: Place;
    onClick: () => void;
}

const MapMarker: React.FC<MarkerProps> = ({ place, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const latitude = parseFloat(place.latitude);
    const longitude = parseFloat(place.longitude);

    return (
        <Marker latitude={latitude} longitude={longitude}>
            <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setTimeout(() => {
                        setIsHovered(false);
                    }, 1000);
                }}
                onClick={onClick}
            >
                <Image
                    src="/assets/map-pin.svg"
                    alt="Marker"
                    width={40}
                    height={40}
                />
            </button>

            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 bg-white shadow-lg rounded-lg p-3 w-64"
                    style={{ top: -100, left: -80 }} // Adjust the position based on your needs
                >
                    <h3 className="font-bold">{place.name}</h3>
                    <p>{place.address_obj.street1}, {place.address_obj.city}</p>
                    <p>{place.address_obj.state}, {place.address_obj.country}</p>
                    <p>{place.phone}</p>
                    <p>Reviews: {place.num_reviews}</p>
                    <a href={place.web_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        View on TripAdvisor
                    </a>
                </motion.div>
            )}
        </Marker>
    );
};

export default MapMarker;
