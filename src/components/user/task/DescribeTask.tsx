import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { LocationPicker } from '../../common/LocationPicker';
import { ListAvailableNeighbors } from '../../../api/neighborApiRequests';
import { NeighborInfo } from '../../../types/neighbor';

interface DescribeTaskProps {
  onContinue: (data: {
    lat: number;
    lng: number;
    address: string;
    taskSize: string;
    taskDetails: string;
    category: string;
    subCategory: string;
    preferredTiming?: string;
    neighbors: NeighborInfo[];
  }) => void;
}

const skillCategories: { [key: string]: string[] } = {
  cleaning: ['Cleaning Apartments', 'Outdoor Cleaning', 'Kitchen Cleaning', 'Deep Clean'],
  delivery: ['Food Delivery', 'Package Delivery', 'Grocery Delivery'],
  handyman: ['Plumbing', 'Electrical', 'Painting', 'Furniture Assembly'],
  moving: ['Packing', 'Loading/Unloading', 'Transportation'],
  gardening: ['Lawn Mowing', 'Planting', 'Weeding'],
  'personal assistant': ['Scheduling', 'Errands', 'Organization'],
};

export const DescribeTask: React.FC<DescribeTaskProps> = ({ onContinue }) => {
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [taskSize, setTaskSize] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [preferredTiming, setPreferredTiming] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [neighbors, setNeighbors] = useState<NeighborInfo[]>([]);
  const [isServiceAvailable, setIsServiceAvailable] = useState<boolean | null>(null);

  const handleCheckAvailability = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lng) {
      toast.info('Please select a location on the map.');
      setShowValidation(true);
      return;
    }
    if (!subcategory) {
      toast.info('Please select a subcategory.');
      setShowValidation(true);
      return;
    }
    setIsLoading(true);
    try {
      const neighborsList = await ListAvailableNeighbors(lng, lat, subcategory);
      setNeighbors(neighborsList);
      setIsServiceAvailable(neighborsList.length > 0);
      setShowValidation(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to check availability.');
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, subcategory]);

  const handleContinue = useCallback(() => {
    setShowValidation(true);
    if (isServiceAvailable === null) {
      toast.error('Please check service availability for your location.');
      return;
    }
    if (!isServiceAvailable) {
      toast.error('Sorry, service is not available in your location yet.');
      return;
    }
    if (!taskSize) {
      toast.error('Please select a task size.');
      return;
    }
    if (!taskDetails) {
      toast.error('Please provide task details.');
      return;
    }
    if (!category) {
      toast.error('Please select a category.');
      return;
    }
    if (!subcategory) {
      toast.error('Please select a subcategory.');
      return;
    }
    if (!preferredTiming) {
      toast.error('Please select when you want the task to be done.');
      return;
    }
    if (!lat || !lng) {
      toast.error('Please select a location.');
      return;
    }
    onContinue({
      lat,
      lng,
      address,
      taskSize,
      taskDetails,
      category,
      subCategory: subcategory,
      preferredTiming,
      neighbors,
    });
  }, [lat, lng, address, taskSize, taskDetails, category, subcategory, preferredTiming, neighbors, isServiceAvailable]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-6">
        <p className="opacity-90 bg-gray-100 p-4 rounded-lg text-gray-700">
          Tell us about your task. We use these details to show Taskers in your area who fit your needs.
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="location-input">
            Where do you need help?
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="location-input"
              type="text"
              value={address}
              readOnly
              placeholder="Select a location on the map"
              className={`flex-1 px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 ${
                showValidation && !address ? 'border-red-600' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-violet-600`}
              aria-label="Selected task location"
            />
          </div>
          <LocationPicker
            height="16rem"
            initialCoordinates={{ lat: 40.7128, lng: -74.006 }}
            onLocationChange={(data) => {
              setAddress(data.address);
              setLat(data.coordinates.lat);
              setLng(data.coordinates.lng);
            }}
            showRadius={false}
            showAddressInput={false}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="category-select">
            Select Task Category
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory('');
              setNeighbors([]);
              setIsServiceAvailable(null);
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 ${
              showValidation && !category ? 'border-red-600' : 'border-gray-300'
            }`}
            aria-label="Task category"
          >
            <option value="">Select a category</option>
            {Object.keys(skillCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="subcategory-select">
            Select Task Subcategory
          </label>
          <select
            id="subcategory-select"
            value={subcategory}
            onChange={(e) => {
              setSubcategory(e.target.value);
              setNeighbors([]);
              setIsServiceAvailable(null);
            }}
            disabled={!category}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 disabled:bg-gray-100 ${
              showValidation && !subcategory && category ? 'border-red-600' : 'border-gray-300'
            }`}
            aria-label="Task subcategory"
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

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            When do you want the task to be done?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Today', value: 'today' },
              { label: 'Within 3 Days', value: 'within_3_days' },
              { label: 'Within This Week', value: 'within_this_week' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPreferredTiming(option.value)}
                aria-pressed={preferredTiming === option.value}
                className={`p-4 border rounded-lg text-center transition ${
                  preferredTiming === option.value
                    ? 'border-violet-600 bg-violet-100 text-[#2E1065]'
                    : showValidation && !preferredTiming
                    ? 'border-red-600'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            You can select a specific date and time later.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCheckAvailability}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !lat || !lng || !subcategory}
            aria-label="Check service availability"
          >
            {isLoading ? 'Checking...' : 'Check Availability'}
          </button>
          {isServiceAvailable === false && (
            <p className="text-red-600">No neighbors available in this location for the selected subcategory.</p>
          )}
          {isServiceAvailable === true && (
            <p className="text-green-600">
              Service available at {address}! {neighbors.length} neighbors found.
            </p>
          )}
        </div>

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
                aria-pressed={taskSize === option.label}
                className={`p-4 border rounded-lg text-center transition ${
                  taskSize === option.label
                    ? 'border-violet-600 bg-violet-100 text-[#2E1065]'
                    : showValidation && !taskSize
                    ? 'border-red-600'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">{option.label}</span>
                <span className="block text-sm text-gray-600">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="task-details">
            Tell us the details of your task
          </label>
          <p className="text-gray-500 pb-4 text-sm">
            Start the conversation and tell your Tasker what you need done. This helps us show you only
            qualified and available Taskers for the job. Don’t worry, you can edit this later.
          </p>
          <textarea
            id="task-details"
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            placeholder="Provide a summary of what you need done for your Tasker. Be sure to include details like the size of your space, any equipment/tools needed, and how to get in."
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 h-32 ${
              showValidation && !taskDetails ? 'border-red-600' : 'border-gray-300'
            }`}
            aria-label="Task details"
          />
        </div>

        <div className="flex justify-center sm:justify-end mt-6">
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium"
            aria-label="Continue to see helpers and prices"
            disabled={isLoading}
          >
            See Helpers and Prices
          </button>
        </div>
      </div>
    </div>
  );
};