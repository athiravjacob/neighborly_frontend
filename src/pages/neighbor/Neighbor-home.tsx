import { useState } from "react";
import { Bell, Home, Calendar, Award, User, LogOut } from "lucide-react";
import CalendarSection from "./Calendar";

const NeighborHome = () => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [activeTaskTab, setActiveTaskTab] = useState("scheduled");

  const renderContent = () => {
    switch (activeSection) {
      case "tasks":
        return <TasksSection activeTab={activeTaskTab} setActiveTab={setActiveTaskTab} />;
      case "calendar":
        return <CalendarSection />;
      case "skills":
        return <SkillsSection />;
      default:
        return <TasksSection activeTab={activeTaskTab} setActiveTab={setActiveTaskTab} />;
    }
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
            onClick={() => alert("Logging out...")}
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
            <div className="text-lg font-semibold text-gray-700">Welcome back, Tasker!</div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 relative hover:bg-gray-200">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-violet-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium">John Doe</span>
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
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <div className="col-span-4">Task</div>
              <div className="col-span-3">Time</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Distance</div>
              <div className="col-span-1"></div>
            </div>
            {[
              { title: "Grocery Shopping for Mrs. Johnson", time: "Today, 2:00 PM", rate: "$25/hr", distance: "0.5 miles" },
              { title: "Lawn Mowing at 123 Oak St", time: "Tomorrow, 10:00 AM", rate: "$30/hr", distance: "1.2 miles" },
            ].map((task, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100">
                <div className="col-span-4 font-semibold text-gray-800">{task.title}</div>
                <div className="col-span-3 text-gray-600">{task.time}</div>
                <div className="col-span-2 text-violet-700 font-medium">{task.rate}</div>
                <div className="col-span-2 text-gray-500">{task.distance}</div>
                <div className="col-span-1">
                  <button className="text-sm text-violet-700 hover:text-violet-900 font-medium">Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <div className="col-span-5">Task</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-2">Earnings</div>
              <div className="col-span-2"></div>
            </div>
            {[
              { title: "Furniture Assembly Help", date: "Mar 18, 2025", earnings: "$45" },
              { title: "Yard Cleanup", date: "Mar 15, 2025", earnings: "$35" },
              { title: "Pet Sitting", date: "Mar 12, 2025", earnings: "$20" },
            ].map((task, i) => (
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

// Calendar Section Component
// const CalendarSection = () => (
//   <div className="bg-white rounded-xl shadow-sm p-6">
//     <h2 className="text-xl font-bold text-violet-950 mb-4">Your Schedule</h2>
//     <div className="text-gray-500">Your upcoming tasks and appointments will appear here in a calendar view.</div>
//     {/* Placeholder for actual calendar implementation */}
//     <div className="mt-4 h-96 bg-gray-100 rounded-lg flex items-center justify-center">
//       <span className="text-gray-400">Calendar Coming Soon</span>
//     </div>
//   </div>
// );


// Skills Section Component
const SkillsSection = () => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      console.log("Adding skill:", newSkill);
      setNewSkill("");
      setIsAddingSkill(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-violet-950">Your Skills</h2>
        <button
          onClick={() => setIsAddingSkill(true)}
          className="px-4 py-2 bg-violet-950 text-white rounded-lg text-sm font-medium hover:bg-violet-800"
        >
          Add Skill
        </button>
      </div>

      {/* Add Skill Form */}
      {isAddingSkill && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter new skill (e.g., Plumbing)"
              className="flex-1 py-2 px-4 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={() => setIsAddingSkill(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-violet-950 text-white rounded-lg text-sm font-medium hover:bg-violet-800"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Skill Ratings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-violet-800">Skill Ratings</h3>
            <p className="text-sm text-gray-500">Based on 28 completed tasks</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-800">4.8</div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { skill: "Home Cleaning", rating: 4.9, tasks: 12 },
            { skill: "Furniture Assembly", rating: 4.7, tasks: 8 },
            { skill: "Yard Work", rating: 4.5, tasks: 5 },
          ].map((skill) => (
            <div key={skill.skill} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-700">{skill.skill}</div>
                <div className="text-sm text-gray-500">{skill.tasks} tasks completed</div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-semibold mr-2">{skill.rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${star <= Math.floor(skill.rating) ? "text-violet-500" : "text-gray-200"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="text-4xl font-bold text-violet-800 mb-2">28</div>
          <div className="text-base text-gray-700">Tasks Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="text-4xl font-bold text-violet-800 mb-2">$850</div>
          <div className="text-base text-gray-700">Earned this month</div>
        </div>
      </div>
    </div>
  );
};

export default NeighborHome;