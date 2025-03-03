// src/pages/Main/TaskList/TaskList.tsx
import React, { useState } from "react";
import TaskCard from "../../components/task/TaskCard";
import TaskFilters from "../../components/task/TaskFilters";
import TaskSort from "../../components/task/TaskSort";
import { useNavigate } from "react-router-dom";

// Sample task data (replace with real data from an API or state management)
const sampleTasks = [
  {
    id: 1,
    title: "Drive me to hospital tomorrow at 10:00 am",
    description: "Accompany me to the hospital, I am an elderly man, so you should know how to drive.",
    budget: "500 - 1000",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JD",
    timePosted: "1 hr",
    category: "Driving & Accompaniment",
    duration: "1hr-2hrs",
    location: "Nearby",
    urgency: "High", // For urgent task sorting
    distance: 2, // In kilometers for "Nearest" sorting (simplified)
  },
  {
    id: 2,
    title: "Help with grocery shopping",
    description: "Need assistance with weekly grocery shopping in my area.",
    budget: "200 - 400",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=AB",
    timePosted: "2 days",
    category: "Grocery Shopping",
    duration: "30min-1hr",
    location: "City Center",
    urgency: "Low",
    distance: 5,
  },
  {
    id: 3,
    title: "Tutoring needed for math",
    description: "Looking for a math tutor for my child, 2 hours daily.",
    budget: "300 - 600",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=XY",
    timePosted: "3 hrs",
    category: "Assignment & Study Help",
    duration: "2hrs-3hrs",
    location: "Suburbs",
    urgency: "Medium",
    distance: 3,
  },
];

// Define urgency levels as a type-safe enum or record
const urgencyOrder: Record<string, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ duration: "", category: "", location: "" });
  const [sortBy, setSortBy] = useState("newest");

  const handlePostTask = () => {
    navigate("/main/post-task"); // Placeholder route for posting a task
  };

  const handleFilterChange = (newFilters: { duration: string; category: string; location: string }) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  // Filter tasks based on duration, category, and location
  let filteredTasks = [...sampleTasks];
  if (filters.duration) {
    filteredTasks = filteredTasks.filter(task => task.duration === filters.duration);
  }
  if (filters.category) {
    filteredTasks = filteredTasks.filter(task => task.category === filters.category);
  }
  if (filters.location) {
    filteredTasks = filteredTasks.filter(task => task.location === filters.location);
  }

  // Sort tasks based on the selected option
  filteredTasks.sort((a, b) => {
    const dateA = new Date(`2025-02-27T${a.timePosted.replace(" ", "T")}:00Z`).getTime();
    const dateB = new Date(`2025-02-27T${b.timePosted.replace(" ", "T")}:00Z`).getTime();
    const budgetA = parseInt(a.budget.split(" - ")[0]);
    const budgetB = parseInt(b.budget.split(" - ")[0]);

    switch (sortBy) {
      case "newest":
        return dateB - dateA;
      case "highest-budget":
        return budgetB - budgetA;
      case "lowest-budget":
        return budgetA - budgetB;
      case "nearest":
        return a.distance - b.distance;
      case "urgent":
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      default:
        return 0;
    }
  });

  return (
    <div className=" min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Available Tasks</h2>
          <button
            onClick={handlePostTask}
            className="bg-violet-950 text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Post a Task
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters and Sort Sidebar */}
          <div className="w-full md:w-64 flex flex-col space-y-4">
            <TaskFilters onFilterChange={handleFilterChange} />
            <TaskSort onSortChange={handleSortChange} />
          </div>

          {/* Task Cards */}
          <div className="flex-1 space-y-5">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">No tasks match your filters.</p>
                <button 
                  onClick={() => setFilters({ duration: "", category: "", location: "" })}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;