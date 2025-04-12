import React, { useState } from 'react';
import useServiceAvailability from '../../../hooks/useServiceAvailability';

interface DescribeTaskProps {
  onContinue: (data: {
    location: string;
    taskSize: string;
    taskDetails: string;
    category: string;
    subCategory: string
  }) => void;
}

const skillCategories: { [key: string]: string[] } = { 
  cleaning: ["Cleaning Apartments", "Outdoor Cleaning", "Kitchen Cleaning", "Deep Clean"],
  delivery: ["Food Delivery", "Package Delivery", "Grocery Delivery"],
  handyman: ["Plumbing", "Electrical", "Painting", "Furniture Assembly"],
  moving: ["Packing", "Loading/Unloading", "Transportation"],
  gardening: ["Lawn Mowing", "Planting", "Weeding"],
  "personal assistant": ["Scheduling", "Errands", "Organization"]
};

export const DescribeTask: React.FC<DescribeTaskProps> = ({ onContinue }) => {
  const [location, setLocation] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [taskSize, setTaskSize] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const { data: isServiceAvailable, isLoading, error } = useServiceAvailability(searchLocation);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() === '') {
      alert('Please enter a location.');
      return;
    }
    setSearchLocation(location);
  };

  const handleContinue = () => {
    if (isServiceAvailable === null || isServiceAvailable === undefined) {
      alert('Please check service availability for your location.');
    } else if (!isServiceAvailable) {
      alert('Sorry, service is not available in your location yet.');
    } else if (!taskSize) {
      alert('Please select a task size.');
    } else if (!taskDetails) {
      alert('Please provide task details.');
    } else if (!category) {
      alert('Please select a category.');
    } else if (!subcategory) {
      alert('Please select a subcategory.');
    } else {
      onContinue({ 
        location, 
        taskSize, 
        taskDetails, 
        category, 
        subCategory:subcategory 
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="text-black p-6">
        <p className="opacity-90 bg-gray-100 p-4 rounded-l">
          Tell us about your task. We use these details to show Taskers in your area who fit your needs.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Location Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Where do you need help?</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city (e.g., New York)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            <button
              onClick={handleCheckAvailability}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Check Availability'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-600">Error: {error.message}</p>}
          {isServiceAvailable === false && (
            <p className="mt-2 text-red-600">Service not available in this location.</p>
          )}
          {isServiceAvailable === true && (
            <p className="mt-2 text-green-600">Service available in {location}!</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Task Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory(''); // Reset subcategory when category changes
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="">Select a category</option>
            {Object.keys(skillCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Task Subcategory</label>
          <select
            value={subcategory}
            onChange={(e) => (setSubcategory(e.target.value))}
            disabled={!category} // Disable if no category is selected
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 disabled:bg-gray-100"
          >
            <option value="">Select a subcategory</option>
            {category &&
              skillCategories[category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </div>

        {/* Task Size Options */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">How big is your task?</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Small', desc: 'Est. 1hr' },
              { label: 'Medium', desc: 'Est. 2-4hr' },
              { label: 'Large', desc: 'Est. 4+hr' },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => setTaskSize(option.label)}
                className={`p-4 border rounded-lg text-center ${
                  taskSize === option.label
                    ? 'border-violet-600 bg-violet-100 text-[#2E1065]'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">{option.label}</span>
                <span className="block text-sm text-gray-600">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Task Details */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tell us the details of your task</label>
          <p className="text-gray-500 pb-4 text-md">
            Start the conversation and tell your Tasker what you need done. This helps us show you only
            qualified and available Taskers for the job. Don’t worry, you can edit this later.
          </p>
          <textarea
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            placeholder="Provide a summary of what you need done for your Tasker. Be sure to include details like the size of your space, any equipment/tools needed, and how to get in."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 h-32"
          />
        </div>

        <div className="flex justify-center sm:justify-end mt-6">
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium"
          >
            See Helpers and Prices
          </button>
        </div>
      </div>
    </div>
  );
};