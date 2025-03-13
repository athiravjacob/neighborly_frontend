// src/components/MenuItem.tsx
import React from "react";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, isCollapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full p-4 text-left hover:bg-violet-900 transition-colors group"
    >
      <span className="text-xl">{icon}</span>
      {!isCollapsed && (
        <span className="ml-4 text-base group-hover:text-gray-200">{label}</span>
      )}
      {isCollapsed && (
        <span className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </button>
  );
};

export default MenuItem;