// src/components/Sidebar.tsx
import React, { useState } from "react";
import MenuItem from "./MenuItems";
import {  useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const navigate = useNavigate()
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-violet-950 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
{isCollapsed ? "☰" : "✖"}        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-2">
        <MenuItem
          icon="👤"
          label="Profile"
          isCollapsed={isCollapsed}
          onClick={() => console.log("Go to Profile")} // Replace with navigation later
        />
        <MenuItem
          icon="⚙️"
          label="Settings"
          isCollapsed={isCollapsed}
          onClick={() => console.log("Go to Settings")}
        />
        <MenuItem
          icon="📋"
          label="Tasks"
          isCollapsed={isCollapsed}
          onClick={() => console.log("Go to Tasks")}
        />
        <MenuItem
          icon="🚪"
          label="Logout"
          isCollapsed={isCollapsed}
          onClick={() => navigate("/login")}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;