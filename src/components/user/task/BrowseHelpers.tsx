"use client";

import React, { useState } from "react";
import { NeighborInfo } from "../../../types/neighbor";

interface BrowseNeighborsProps {
  onContinue: (selectedNeighbor: NeighborInfo) => void;
  neighbors: NeighborInfo[];
  taskData: { location: string; taskSize: string; taskDetails: string };
}

export const BrowseNeighbors: React.FC<BrowseNeighborsProps> = ({
  onContinue,
  neighbors,
  taskData,
}) => {
  const [selectedNeighbor, setSelectedNeighbor] = useState<NeighborInfo| null>(null);

  const handleSelect = (id: string) => {
    console.log(id,"handle select")
    const selected = neighbors.find(n => n._id === id)
    console.log(selected,"selected")
    setSelectedNeighbor(selected!);
  };

  const handleContinue = () => {
    if (selectedNeighbor) {
      onContinue(selectedNeighbor);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="text-black p-6">
        <p className="opacity-90 p-4 bg-gray-100">
          Select a neighbor to help with your task.
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Neighbor Cards */}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Available neighbors ({neighbors.length})</h3>
          {neighbors.length === 0 ? (
            <div className="text-center p-8 bg-violet-50 rounded-lg">
              <p className="text-gray-600 mb-2">No neighbors available at this time.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {neighbors.map((helper) => (
                <div
                  key={helper._id}
                  className={`border ${selectedNeighbor?._id === helper._id ? "border-violet-600" : "border-gray-200"} rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div>
                            <h4 className="text-xl font-semibold">{helper.name}</h4>
                            {/* <p className="text-gray-600 mt-1">{helper.availableLocations.city}</p> */}
                            <p className="text-gray-500 text-sm">{helper.email}</p>
                          </div>
                          <div className="mt-4 md:mt-0 text-right">
                            <p className="text-2xl font-bold text-violet-800">₹{helper.skills[0].hourlyRate}/hr</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-gray-700">{helper.skills[0].description}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm">
                            {helper.skills[0].category}
                          </span>
                          {helper.skills[0].subcategories.map((subcat) => (
                            <span key={subcat} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm">
                              {subcat}
                            </span>
                          ))}
                        </div>

                        {/* <div className="mt-4">
                          <p className="text-gray-600 font-medium">Available Time Slots:</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {helper.timeSlots.map((slot, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {new Date(slot).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            ))}
                          </div>
                        </div> */}

                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <button
                            key={helper._id}
                            onClick={() => handleSelect(helper._id)}
                            className={`px-6 py-3 rounded-lg w-full sm:w-auto ${
                              selectedNeighbor?._id === helper._id
                                ? "bg-violet-600 text-white"
                                : "border border-violet-600 text-violet-600 hover:bg-violet-50"
                            }`}
                          >
                            {selectedNeighbor?._id === helper._id ? "Selected" : "Select"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedNeighbor}
              className={`px-8 py-4 rounded-lg text-lg font-medium ${
                selectedNeighbor
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue with Selected Neighbor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};