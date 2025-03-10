// src/components/SearchBar.tsx
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-1/3 max-w-md">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
        🔍
      </span>
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white"
      />
    </div>
  );
};

export default SearchBar;