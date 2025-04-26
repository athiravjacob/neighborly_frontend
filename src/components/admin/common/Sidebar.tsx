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
    navigate("/admin");
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-950 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">

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
          label="Users"
          isCollapsed={isCollapsed}
          onClick={() => navigate("users")} 
          />
          </div>
      
      <div className="space-y-1">
        <MenuItem
          icon={<PersonIcon />}
          label="Neighbor"
          isCollapsed={isCollapsed}
          onClick={() => navigate("neighbors")} 
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