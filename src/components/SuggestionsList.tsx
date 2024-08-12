// components/SuggestionsList.tsx
// for directions page , destination and source suggestions
import React from "react";

interface SuggestionProps {
  suggestions: Array<{ display_name: string; lat: string; lon: string }>;
  onSelect: (suggestion: {
    display_name: string;
    lat: string;
    lon: string;
  }) => void;
}

const Suggestions: React.FC<SuggestionProps> = ({ suggestions, onSelect }) => {
  return (
    <div
      className="absolute z-10 bg-white shadow-lg rounded mt-1 w-full max-h-60 overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => onSelect(suggestion)}
          className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
        >
          {suggestion.display_name}
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
