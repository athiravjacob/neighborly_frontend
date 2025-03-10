// src/components/task/TaskSort/TaskSort.tsx
import React from "react";

interface TaskSortProps {
  onSortChange: (sortBy: string) => void;
}

const TaskSort: React.FC<TaskSortProps> = ({ onSortChange }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Order tasks by</label>
        <select
          onChange={handleSortChange}
          defaultValue="newest"
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="highest-budget">Highest Budget</option>
          <option value="lowest-budget">Lowest Budget</option>
          <option value="nearest">Nearest Location</option>
          <option value="urgent">Most Urgent</option>
        </select>
      </div>
      
      <div className="mt-6 pt-5 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-lg text-sm hover:text-indigo-700 transition-colors">
            High Urgency Tasks
          </button>
          <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-lg text-sm hover:text-indigo-700 transition-colors">
            Nearby Only
          </button>
          <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-lg text-sm hover:text-indigo-700 transition-colors">
            Short Duration Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskSort;