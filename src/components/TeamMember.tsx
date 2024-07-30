import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <motion.div
      className="flex flex-col md:flex-row items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={imageSrc}
        alt={name}
        width={200}
        height={200}
        className="w-24 h-24 rounded-full mb-4"
      />
      <div className=" w-24 h-0.5 bg-teal-500 hidden md:block mx-4"></div>
      <div className="ml-0 md:ml-4 mb-4 md:mb-auto flex flex-col justify-center items-center ">
        <h3 className="font-bold text-left">{name}</h3>
        <p className="text-teal-500 text-sm mb-2 text-left ">{title}</p>
        <p className="text-gray-700 max-w-xs">{vision}</p>
      </div>
    </motion.div>
  );
};

export default TeamMember;
