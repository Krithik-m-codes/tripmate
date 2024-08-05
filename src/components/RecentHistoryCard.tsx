import React from "react";
import { History } from "lucide-react";
interface RecentHistoryCardProps {
  destination: string;
  date: string;
}

const RecentHistoryCard: React.FC<RecentHistoryCardProps> = ({
  destination,
  date,
}) => {
  return (
    <div className="bg-white rounded-lg w-full scroll-auto shadow-md p-4 flex justify-normal items-center my-3">
      <div className="grow-0 mx-6">
        <History size={32} color="black" />
      </div>
      <div className="grow w-full">
        <h2 className="text-xl font-bold mb-2">{destination}</h2>
        <p className="text-gray-500">{date}</p>
      </div>
    </div>
  );
};

export default RecentHistoryCard;
