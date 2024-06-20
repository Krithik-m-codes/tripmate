"use client";
import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed flex flex-col h-full transition-transform duration-300 ${
        isOpen ? "translate-x-10" : "-translate-x-full"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-[#A6CF39] p-4">
        <div className="bg-white h-12 w-12 rounded-full"></div>
      </div>
      <nav className="bg-[#2C2C2C] flex-1">
        <ul className="space-y-8 mt-12">
          <li className="pl-4">
            <a href="#" className="flex items-center py-2">
              <i className="fas fa-bookmark mr-2"></i> Saved Places
            </a>
          </li>
          <li className="pl-4">
            <a href="#" className="flex items-center py-2">
              <i className="fas fa-map-signs mr-2"></i> Directions
            </a>
          </li>
          <li className="pl-4">
            <a href="#" className="flex items-center py-2">
              <i className="fas fa-user mr-2"></i> Profile
            </a>
          </li>
          <li className="pl-4">
            <a href="#" className="flex items-center py-2">
              <i className="fas fa-sign-out-alt mr-2"></i> Log Out
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
