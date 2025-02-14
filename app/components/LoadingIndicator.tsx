import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full animate-ping bg-blue-500"></div>
      <div className="w-4 h-4 rounded-full animate-ping bg-blue-500"></div>
      <div className="w-4 h-4 rounded-full animate-ping bg-blue-500"></div>
    </div>
  );
};

export default LoadingIndicator;
