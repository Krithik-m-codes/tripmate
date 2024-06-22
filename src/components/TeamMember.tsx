import React from "react";
import Image from "next/image";

interface TeamMemberProps {
  name: string;
  title: string;
  vision: string;
  imageSrc: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  title,
  vision,
  imageSrc,
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src={imageSrc}
        alt={name}
        width={200}
        height={200}
        className="w-24 h-24 rounded-full mb-4"
      />
      <h3 className="font-bold">{name}</h3>
      <p className="text-teal-500 text-sm mb-2">{title}</p>
      <p className="text-gray-700 max-w-xs">{vision}</p>
    </div>
  );
};

export default TeamMember;
