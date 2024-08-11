import React from "react";

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-yellow-300 rounded-full">
          <div className="w-16 h-16 border-8 border-black border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute w-2 h-2 bg-black rounded-full bottom-6 left-8"></div>
          <div className="absolute w-4 h-8 bg-black rounded-full top-6 right-8"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
