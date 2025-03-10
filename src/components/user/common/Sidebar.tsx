import React, { useState } from "react";
import MenuItem from "./MenuItems";
import {  useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskIcon from "@mui/icons-material/Task";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, persistor } from '../../../redux/store';
import { clearCredentials } from "../../../redux/slices/authSlice";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const navigate = useNavigate()
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const dispatch = useDispatch();

  
  const user = useSelector((state: RootState) => state.auth.user);
  
  const handleLogout = async() => {
    dispatch(clearCredentials());
    await persistor.purge(); 
    navigate("/signup");
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-violet-950 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
{/*           <img
            src={}
            alt="User avatar"
            className={`rounded-full border-2 border-indigo-500 transition-all duration-300 ${
              isCollapsed ? "w-10 h-10" : "w-12 h-12"
            }`}
          /> */}
          {!isCollapsed && (
            <div className="flex-1 animate-fadeIn">
              <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
              <p className="text-sm text-gray-400">{user?.email }</p>
            </div>
          )}
        </div>
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <span className="text-xl">→</span>
          ) : (
            <span className="text-xl">←</span>
          )}
        </button>
      </div>

     

      {/* Menu Items */}
      <nav className="flex flex-col h-[calc(100%-8rem)] justify-between py-6">
        <div className="space-y-1">
        <MenuItem
          icon={<PersonIcon />}
          label="Profile"
          isCollapsed={isCollapsed}
          onClick={() => navigate("profile")} // Replace with navigation later
        />
        <MenuItem
          icon={<SettingsIcon />}
          label="Settings"
          isCollapsed={isCollapsed}
          onClick={() =>navigate("settings")}
        />
        <MenuItem
          icon={<TaskIcon />}
          label="Tasks"
          isCollapsed={isCollapsed}
          onClick={() => navigate("task-list")}
        />
        
          </div>
        <div className="mt-auto">
          <MenuItem
            icon={<LogoutIcon />}
            label="Logout"
            isCollapsed={isCollapsed}
            onClick={handleLogout}
          />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;