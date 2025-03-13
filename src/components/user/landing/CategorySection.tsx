"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Truck, Wrench, Leaf, PackageOpen, ClipboardList, ChevronRight } from "lucide-react"
import cleaning from '../../../assets/categories/Cleaning.jpg'
import gardening from '../../../assets/categories/gardening.jpg'
import drive from '../../../assets/categories/drive.jpg'
import handyman from '../../../assets/categories/handyman.jpg'
import delivery from '../../../assets/categories/delivery.jpg'
import moving from '../../../assets/categories/moving.jpg'
import { useNavigate } from "react-router-dom"

// Define category data with Lucide icons instead of emojis
const categories = [
  {
    name: "Cleaning",
    icon: Sparkles,
    description:
      "Transform your space with top-notch cleaning services. From routine tidying to deep scrubs, our trusted helpers handle everything—dusting, vacuuming, window washing, and more—for a spotless home or office.",
    image: cleaning, // Update path to match your asset structure
  },
  {
    name: "Delivery",
    icon: Truck,
    description:
      "Need something picked up or dropped off? Our reliable helpers offer fast delivery for groceries, packages, or even last-minute errands, saving you time and hassle wherever you are.",
    image: delivery,
  },
  {
    name: "Handyman",
    icon: Wrench,
    description:
      "Fix it, build it, or spruce it up—our skilled handymen tackle minor repairs, furniture assembly, painting, and home improvements with precision, so your space works and looks its best.",
    image: handyman
  },
  {
    name: "Gardening",
    icon: Leaf,
    description:
      "Keep your outdoors thriving with expert gardening help. Whether it's mowing the lawn, planting flowers, weeding, or seasonal cleanup, our helpers bring your yard to life.",
    image: gardening
  },
    {
        name: "Moving",
        icon: PackageOpen,
        description:
            "Moving made simple. Our efficient helpers assist with packing, loading, unloading, and even junk removal, ensuring your home or business relocation is smooth and stress-free.",
        image: moving
    },
  {
    name: "Personal Assistant",
    icon: ClipboardList,
    description:
      "Stay on top of life with a helping hand. From organizing your schedule and running errands to event setup or pet care, our assistants handle the details so you don't have to.",
    image: drive
  },
]

const CategorySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
    const navigate = useNavigate()
  return (
    <section className="py-16 bg-gradient-to-b from-white to-violet-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E1065] mb-4">Explore Our Services</h2>
          <div className="w-24 h-1 bg-violet-600 mx-auto rounded-full"></div>
        </div>

        {/* Categories List - Improved design */}
        <div className="relative">
          <div className="flex justify-start md:justify-center space-x-3 md:space-x-6 overflow-x-auto pb-6 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory.name === category.name

              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 min-w-[100px] ${
                    isSelected
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-200 scale-105"
                      : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-violet-50"
                  }`}
                >
                  <div className={`p-3 rounded-full mb-3 ${isSelected ? "bg-violet-500" : "bg-violet-100"}`}>
                    <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-violet-600"}`} />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Details - Enhanced presentation */}
        <motion.div
          key={selectedCategory.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          {/* Left side: Description */}
          <div className="order-2 md:order-1">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-violet-100 rounded-full mr-4">
                {React.createElement(selectedCategory.icon, {
                  className: "w-6 h-6 text-violet-600",
                })}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#2E1065]">{selectedCategory.name}</h3>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{selectedCategory.description}</p>

            <button onClick={()=>navigate("/create-task")} className="inline-flex items-center px-5 py-3 bg-violet-600 text-white rounded-lg font-medium transition-colors hover:bg-violet-700">
              Book Now
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          {/* Right side: Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src={selectedCategory.image || "/placeholder.svg"}
                alt={selectedCategory.name}
                className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CategorySection

