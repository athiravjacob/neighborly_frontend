// src/components/task/TaskCard/TaskCard.tsx
import React from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  budget: string;
  userAvatar: string;
  timePosted: string;
  category: string;
  duration?: string;
  location?: string;
  urgency?: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  // Function to determine the urgency badge color
  const getUrgencyColor = (urgency?: string) => {
    if (!urgency) return "bg-gray-100 text-gray-600";
    
    switch (urgency) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-amber-100 text-amber-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img
            src={task.userAvatar}
            alt="User avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
            <span className="text-gray-500 text-sm">{task.timePosted} ago</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
            Rs. {task.budget}
          </span>
          {task.urgency && (
            <span className={`${getUrgencyColor(task.urgency)} px-3 py-1 mt-2 rounded-full text-xs font-medium`}>
              {task.urgency} Urgency
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
          {task.category}
        </span>
        {task.duration && (
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
            {task.duration}
          </span>
        )}
        {task.location && (
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
            {task.location}
          </span>
        )}
      </div>
      
      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
        <button className="bg-violet-950 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

export default TaskCard;