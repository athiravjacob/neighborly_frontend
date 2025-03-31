import { useState } from "react";
import { Bell, Home, Calendar, Award, User, LogOut } from "lucide-react";
import CalendarSection from "./Calendar";
import SkillsSection from "./Skills";
import ServiceLocation from "./ServiceLocation";
import { useSelector } from "react-redux";
import { RootState, persistor } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../../redux/slices/authSlice";
import { logout } from "../../api/apiRequests";
import { useDispatch } from "react-redux";

const NeighborHome = () => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [activeTaskTab, setActiveTaskTab] = useState("scheduled");
  const { user ,isAuthenticated} = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const renderContent = () => {
    switch (activeSection) {
      case "tasks":
        return <TasksSection activeTab={activeTaskTab} setActiveTab={setActiveTaskTab} />;
      case "calendar":
        return <CalendarSection />;
      case "skills":
        return <SkillsSection />;
      case "location":
        return <ServiceLocation />;
      
      default:
        return <TasksSection activeTab={activeTaskTab} setActiveTab={setActiveTaskTab} />;
    }
  };
  if (!isAuthenticated || !user ||user.type !== 'neighbor') {
    navigate('/neighbor'); 
    return null;
  }

  const handleLogout = async () => {
    
    dispatch(clearCredentials());
    await persistor.purge(); 
    await logout()
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
            onClick={() => setActiveSection("tasks")}
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
            <Award size={20} className="mr-3" />
            Location
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
            <div className="text-lg font-semibold text-gray-700">Welcome back, {user?.name} </div>
            <div className="flex items-center space-x-4">
              {/* <button className="p-2 rounded-full bg-gray-100 text-gray-600 relative hover:bg-gray-200">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-violet-500 rounded-full"></span>
              </button> */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium">{user.name }</span>
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

// Tasks Section Component
const TasksSection = ({ activeTab, setActiveTab }) => {
  const scheduledTasks: any[] = []; 
  const previousTasks = [
    { title: "Furniture Assembly Help", date: "Mar 18, 2025", earnings: "$45" },
    { title: "Yard Cleanup", date: "Mar 15, 2025", earnings: "$35" },
    { title: "Pet Sitting", date: "Mar 12, 2025", earnings: "$20" },
  ];

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`py-3 px-6 text-sm font-medium ${
            activeTab === "scheduled"
              ? "text-violet-950 border-b-2 border-violet-950"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Scheduled Tasks
        </button>
        <button
          onClick={() => setActiveTab("previous")}
          className={`py-3 px-6 text-sm font-medium ${
            activeTab === "previous"
              ? "text-violet-950 border-b-2 border-violet-950"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Previous Tasks
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-xl shadow-sm p-6">
        {activeTab === "scheduled" ? (
          scheduledTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No tasks scheduled yet</p>
              <p className="text-gray-500 mt-2">
                Please complete your profile to get matched with tasks
              </p>
              <button className="mt-4 px-4 py-2 bg-violet-700 text-white rounded-md hover:bg-violet-900">
                Complete Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                <div className="col-span-4">Task</div>
                <div className="col-span-3">Time</div>
                <div className="col-span-2">Rate</div>
                <div className="col-span-2">Distance</div>
                <div className="col-span-1"></div>
              </div>
              {scheduledTasks.map((task, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100">
                  <div className="col-span-4 font-semibold text-gray-800">{task.title}</div>
                  <div className="col-span-3 text-gray-600">{task.time}</div>
                  <div className="col-span-2 text-violet-700 font-medium">{task.rate}</div>
                  <div className="col-span-2 text-gray-500">{task.distance}</div>
                  <div className="col-span-1">
                    <button className="text-sm text-violet-700 hover:text-violet Mathew font-medium">Details</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <div className="col-span-5">Task</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-2">Earnings</div>
              <div className="col-span-2"></div>
            </div>
            {previousTasks.map((task, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100">
                <div className="col-span-5 font-medium text-gray-800">{task.title}</div>
                <div className="col-span-3 text-gray-600">{task.date}</div>
                <div className="col-span-2 text-green-500 font-medium">+{task.earnings}</div>
                <div className="col-span-2">
                  <button className="text-sm text-violet-700 hover:text-violet-900 font-medium">Receipt</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



export default NeighborHome