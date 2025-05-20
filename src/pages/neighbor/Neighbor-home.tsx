import { useState } from "react";
import { Bell, Home, Calendar, Award, User, LogOut, BadgeCheck, MapPin, Settings } from "lucide-react";
import CalendarSection from "./Calendar";
import SkillsSection from "./Skills";
import ServiceLocation from "./ServiceLocation";
import { useSelector } from "react-redux";
import { RootState, persistor } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../../redux/slices/authSlice";
import { logout } from "../../api/apiRequests";
import { useDispatch } from "react-redux";
import TaskListed_Neighbor from "../../components/neighbor/TasksListed_Neighbor";
import Verification from "../../components/neighbor/Verification";
import { clearVerificationStatus } from "../../redux/slices/verificationSlice";
import EarningsDashboard from "./EarningsDashboard";
import TaskDetails from "../../components/neighbor/TaskDetails";
import PasswordSettings from "../../components/neighbor/PasswordSettings";

const NeighborHome = () => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleBackToTasks = () => {
    setSelectedTaskId(null);
  };

  const renderContent = () => {
    if (activeSection === "tasks" && selectedTaskId) {
      return <TaskDetails taskId={selectedTaskId} onBack={handleBackToTasks} />;
    }

    switch (activeSection) {
      case "tasks":
        return <TaskListed_Neighbor onTaskSelect={handleTaskSelect} />;
      case "calendar":
        return <CalendarSection />;
      case "skills":
        return <SkillsSection />;
      case "location":
        return <ServiceLocation />;
      case "Verification":
        return <Verification />;
      case "Earnings":
        return <EarningsDashboard />;
        case "Settings":
          return <PasswordSettings />;
      default:
        return <TaskListed_Neighbor onTaskSelect={handleTaskSelect} />;
    }
  };

  if (!isAuthenticated || !user || user.type !== 'neighbor') {
    navigate('/neighbor');
    return null;
  }

  const handleLogout = async () => {
    dispatch(clearCredentials());
    dispatch(clearVerificationStatus());
    await persistor.purge();
    await logout();
    navigate('/neighbor');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-md h-screen fixed top-0 left-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-violet-950">Neighborly</h1>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => {
              setActiveSection("tasks");
              setSelectedTaskId(null);
            }}
            className={`w-full flex items-center px-6 py-3 text-left ${
              activeSection === "tasks" ? "bg-violet-50 text-violet-950" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home size={20} className="mr-3" />
            Tasks
          </button>
          <button
            onClick={() => setActiveSection("calendar")}
            className={`w-full flex items-center px-6 py-3 text-left ${
              activeSection === "calendar" ? "bg-violet-50 text-violet-950" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Calendar size={20} className="mr-3" />
            Schedule
          </button>
          <button
            onClick={() => setActiveSection("skills")}
            className={`w-full flex items-center px-6 py-3 text-left ${
              activeSection === "skills" ? "bg-violet-50 text-violet-950" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Award size={20} className="mr-3" />
            Skills
          </button>
          <button
            onClick={() => setActiveSection("location")}
            className={`w-full flex items-center px-6 py-3 text-left ${
              activeSection === "location" ? "bg-violet-50 text-violet-950" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MapPin size={20} className="mr-3" />
            Location
          </button>
          <button
            onClick={() => setActiveSection("Verification")}
            className={`w-full flex items-center px-6 py-3 text-left ${
              activeSection === "Verification" ? "bg-violet-50 text-violet-950" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BadgeCheck size={20} className="mr-3" />
            Verification
          </button>
          <button
            onClick={() => setActiveSection("Earnings")}
            className={`w-full flex items-center px-6 py-3 text-left ${
              activeSection === "Earnings" ? "bg-violet-50 text-violet-950" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BadgeCheck size={20} className="mr-3" />
            Earnings
          </button>

          <button
            onClick={() => setActiveSection("Settings")}
            className={`w-full flex items-center px-6 py-3 text-left ${
              activeSection === "Earnings" ? "bg-violet-50 text-violet-950" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BadgeCheck size={20} className="mr-3" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-left text-gray-600 hover:bg-gray-100 mt-auto absolute bottom-6"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-700">Welcome back, {user?.name}</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="container mx-auto px-6 py-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default NeighborHome;