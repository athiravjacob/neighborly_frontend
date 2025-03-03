// src/components/task/TaskFilters/TaskFilters.tsx
import React, { useState } from "react";

interface TaskFiltersProps {
  onFilterChange: (filters: { duration: string; category: string; location: string }) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({ duration: "", category: "", location: "" });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { duration: "", category: "", location: "" };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {(filters.duration || filters.category || filters.location) && (
          <button 
            onClick={handleClearFilters}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <select
            name="duration"
            value={filters.duration}
            onChange={handleFilterChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="">Any duration</option>
            <option value="30min-1hr">30 min - 1 hr</option>
            <option value="1hr-2hrs">1 hr - 2 hrs</option>
            <option value="2hrs-3hrs">2 hrs - 3 hrs</option>
            <option value="more-4hrs">More than 4 hrs</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="">All categories</option>
            <option value="Driving & Accompaniment">Driving & Accompaniment</option>
            <option value="Grocery Shopping">Grocery Shopping</option>
            <option value="Gardening & Home Help">Gardening & Home Help</option>
            <option value="Cleaning & Maintenance">Cleaning & Maintenance</option>
            <option value="Assignment & Study Help">Assignment & Study Help</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="">Any location</option>
            <option value="Nearby">Nearby</option>
            <option value="City Center">City Center</option>
            <option value="Suburbs">Suburbs</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;