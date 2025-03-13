"use client"

import type React from "react"
import { useState } from "react"
import { Star, Calendar, Clock, DollarSign, Filter, X, User, MessageCircle } from "lucide-react"

interface BrowseHelpersProps {
  onContinue: (selectedHelper: string) => void
  taskData: { location: string; taskSize: string; taskDetails: string }
}

export const BrowseHelpers: React.FC<BrowseHelpersProps> = ({ onContinue, taskData }) => {
  const [dateFilter, setDateFilter] = useState("Today")
  const [timeFilter, setTimeFilter] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000])
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")
  const [showProfileModal, setShowProfileModal] = useState<string | null>(null)

  // Dummy helper data (replace with API call later)
  const helpers = [
    {
      id: "1",
      name: "John D.",
      rating: 4.8,
      reviews_no: 32,
      tasksCompleted: 120,
      taskType: "Handyman tasks",
      taskTypeOverall: "145 Handyman tasks overall",
      bio: "I specialize in home repairs and maintenance with over 5 years of experience. From furniture assembly to minor electrical work, I tackle tasks with precision and care.",
      hourlyRate: 650,
      image: "/api/placeholder/180/180",
      location: "Mumbai",
      helpDescription:
        "I can help with furniture assembly, mounting TVs, basic plumbing repairs, minor electrical work, and general home repairs. My toolkit is always ready for any handyman task.",
      tags: ["Handyman", "Repairs", "Electrical"],
      reviews: [
        {
          user: "Rahul M.",
          date: "Mon, Mar 10",
          comment:
            "John was excellent! Fixed all the issues in my kitchen and even gave advice on preventing future problems. Very punctual and professional.",
        },
        {
          user: "Priya K.",
          date: "Sun, Feb 25",
          comment:
            "Showed up on time, very professional, I highly recommend John and would definitely work with him again.",
        },
      ],
    },
    {
      id: "2",
      name: "Latisha B.",
      rating: 4.9,
      reviews_no: 26,
      tasksCompleted: 38,
      taskType: "Cleaning tasks",
      taskTypeOverall: "36 Cleaning tasks overall",
      bio: "Keeping your home clean and inviting is my priority! I specialize in general housekeeping, including sanitizing surfaces, cleaning kitchens, bathrooms, steam mopping floors, and tidying living areas.",
      hourlyRate: 449,
      image: "/api/placeholder/180/180",
      location: "Delhi",
      helpDescription:
        "Keeping your home clean and inviting is my priority! I specialize in general housekeeping, including sanitizing surfaces, cleaning kitchens, bathrooms, steam mopping floors, and tidying living areas. Whether it's regular upkeep or preparing your home for guests, I'll ensure your space is stress-free...",
      tags: ["Cleaning", "Organization", "Sanitizing"],
      reviews: [
        {
          user: "Ameer B.",
          date: "Thu, Feb 27",
          comment:
            "Latisha provided excellent service! Best housekeeping we've utilized in Atlanta being here 5 years! Outside of the house being spotless, she took initiative to do the smallest details - making things more organized, finding places for things left out.",
        },
        {
          user: "Maya T.",
          date: "Wed, Feb 14",
          comment:
            "Exceptional attention to detail! My apartment hasn't been this clean since I moved in. Will definitely book again.",
        },
      ],
    },
    {
      id: "3",
      name: "Mike J.",
      rating: 4.7,
      reviews_no: 41,
      tasksCompleted: 200,
      taskType: "Moving tasks",
      taskTypeOverall: "210 Moving tasks overall",
      bio: "Professional mover with years of experience handling all types of moves from small apartments to large homes. Strong, careful, and efficient.",
      hourlyRate: 700,
      image: "/api/placeholder/180/180",
      location: "Bangalore",
      helpDescription:
        "I offer professional moving services with a focus on efficiency and safety. I can help with heavy lifting, packing, loading/unloading, furniture disassembly and reassembly. Whether you're moving across town or just rearranging your space, I'll make the process smooth and stress-free.",
      tags: ["Moving", "Heavy Lifting", "Packing"],
      reviews: [
        {
          user: "Ananya S.",
          date: "Sun, Mar 3",
          comment:
            "Mike made moving day so easy. He was incredibly strong and careful with all our belongings. Nothing was damaged and he worked tirelessly the whole time.",
        },
        {
          user: "Karan P.",
          date: "Fri, Feb 16",
          comment:
            "Excellent service! Mike helped me move my 2-bedroom apartment and finished faster than I expected. Very professional and courteous.",
        },
      ],
    },
  ]

  // Sort helpers based on selected option
  const sortedHelpers = [...helpers].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.hourlyRate - b.hourlyRate
      case "price-high":
        return b.hourlyRate - a.hourlyRate
      case "rating":
        return b.rating - a.rating
      case "tasks":
        return b.tasksCompleted - a.tasksCompleted
      default:
        return 0 // recommended - default order
    }
  })

  const filteredHelpers = sortedHelpers.filter(
    (helper) => helper.hourlyRate >= priceRange[0] && helper.hourlyRate <= priceRange[1],
  )

  const handleContinue = () => {
    if (!selectedHelper) {
      alert("Please select a helper.")
    } else {
      onContinue(selectedHelper)
    }
  }

  const selectedHelperData = helpers.find((h) => h.id === showProfileModal)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
    <div className="bg-violet-700 text-white p-6">
      <h2 className="text-2xl font-bold mb-2">Browse Taskers and prices</h2>
      <p className="opacity-90">
        Filter and sort to find your Tasker. Then view their availability to request your date and time.
      </p>
    </div>
    <div className="p-6 space-y-6">

      {/* Sorting options */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            className="md:hidden flex items-center gap-2 text-violet-600 font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X size={20} /> : <Filter size={20} />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
            <option value="tasks">Most Tasks</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Filters */}
        <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/3 lg:w-1/3`}>
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Filters</h3>

            {/* Date Options */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-2" />
                Date
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                <option value="Today">Today</option>
                <option value="Within 3 Days">Within 3 Days</option>
                <option value="Within a Week">Within a Week</option>
                <option value="Choose a Date">Choose a Date</option>
              </select>
              {dateFilter === "Choose a Date" && (
                <input
                  type="date"
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              )}
            </div>

            {/* Time Options */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Clock size={16} className="mr-2" />
                Time of Day
              </label>
              <div className="space-y-2">
                {[
                  { label: "Morning", desc: "8:00 - 12:00" },
                  { label: "Afternoon", desc: "12:00 - 17:00" },
                  { label: "Evening", desc: "17:00 - 21:00" },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setTimeFilter(option.label)}
                    className={`w-full p-4 border rounded-lg text-left ${
                      timeFilter === option.label
                        ? "border-violet-600 bg-violet-100 text-[#2E1065]"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="block text-sm text-gray-600">{option.desc}</span>
                  </button>
                ))}
                <button
                  onClick={() => setTimeFilter("Specific Time")}
                  className={`w-full p-4 border rounded-lg text-left ${
                    timeFilter === "Specific Time"
                      ? "border-violet-600 bg-violet-100 text-[#2E1065]"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Choose Specific Time
                </button>
                {timeFilter === "Specific Time" && (
                  <input
                    type="time"
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <DollarSign size={16} className="mr-2" />
                Price Range (₹/hr)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  min={100}
                  max={5000}
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  min={100}
                  max={5000}
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span>₹100</span>
                <span>₹5000</span>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-violet-600 rounded-full"
                    style={{
                      width: `${((priceRange[1] - priceRange[0]) / 4900) * 100}%`,
                      marginLeft: `${((priceRange[0] - 100) / 4900) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Helper Cards */}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Available Helpers ({filteredHelpers.length})</h3>
          {filteredHelpers.length === 0 ? (
            <div className="text-center p-8 bg-violet-50 rounded-lg">
              <p className="text-gray-600 mb-2">No helpers available in this price range.</p>
              <button onClick={() => setPriceRange([100, 5000])} className="text-violet-600 font-medium">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHelpers.map((helper) => (
                <div
                  key={helper.id}
                  className={`border ${selectedHelper === helper.id ? "border-violet-600" : "border-gray-200"} rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Image */}
                      <div className="flex flex-col items-center">
                        <img
                          src={helper.image || "/placeholder.svg"}
                          alt={helper.name}
                          className="w-32 h-32 rounded-full object-cover"
                        />
                        <div className="mt-2 text-center">
                          <button
                            onClick={() => setShowProfileModal(helper.id)}
                            className="text-green-600 font-medium text-sm hover:underline"
                          >
                            View Profile & Reviews
                          </button>
                        </div>
                      </div>

                      {/* Helper Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div>
                            <h4 className="text-xl font-semibold">{helper.name}</h4>
                            <div className="flex items-center mt-1">
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                              <span className="ml-1 font-medium">{helper.rating}</span>
                              <span className="ml-1 text-gray-600">({helper.reviews_no} reviews)</span>
                            </div>
                            <p className="text-gray-600 mt-1">{helper.taskType}</p>
                            <p className="text-gray-500 text-sm">{helper.taskTypeOverall}</p>
                          </div>
                          <div className="mt-4 md:mt-0 text-right">
                            <p className="text-2xl font-bold text-violet-800">₹{helper.hourlyRate}/hr</p>
                            <p className="text-gray-500 text-sm">Est. ₹{helper.hourlyRate * 3} for this task</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-gray-700 line-clamp-3">{helper.helpDescription}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {helper.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <button
                            onClick={() => setSelectedHelper(helper.id)}
                            className={`px-6 py-3 rounded-lg w-full sm:w-auto ${
                              selectedHelper === helper.id
                                ? "bg-violet-600 text-white"
                                : "border border-violet-600 text-violet-600 hover:bg-violet-50"
                            }`}
                          >
                            {selectedHelper === helper.id ? "Selected" : "Select"}
                          </button>
                          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
                            Chat with {helper.name.split(" ")[0]}
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
              disabled={!selectedHelper}
              className={`px-8 py-4 rounded-lg text-lg font-medium ${
                selectedHelper
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue with Selected Helper
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedHelperData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedHelperData.image || "/placeholder.svg"}
                    alt={selectedHelperData.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold">{selectedHelperData.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{selectedHelperData.rating}</span>
                      <span className="ml-1 text-gray-600">({selectedHelperData.reviews_no} reviews)</span>
                    </div>
                    <p className="text-gray-600">{selectedHelperData.location}</p>
                  </div>
                </div>
                <button onClick={() => setShowProfileModal(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">About</h4>
                <p className="text-gray-700">{selectedHelperData.bio}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHelperData.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">How I can help</h4>
                <p className="text-gray-700">{selectedHelperData.helpDescription}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2 flex items-center">
                  <MessageCircle size={20} className="mr-2" />
                  Reviews ({selectedHelperData.reviews.length})
                </h4>
                <div className="space-y-4 mt-4">
                  {selectedHelperData.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span className="font-medium">{review.user}</span>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => {
                    setSelectedHelper(selectedHelperData.id)
                    setShowProfileModal(null)
                  }}
                  className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Select {selectedHelperData.name.split(" ")[0]}
                </button>
                <button
                  onClick={() => setShowProfileModal(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
  )
}

