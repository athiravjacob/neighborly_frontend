import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
           
              <span className="text-2xl font-bold text-[#2E1065]" onClick={()=>navigate("/")}>Neighborly</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <a href="" className="text-gray-600 hover:text-[#2E1065] font-medium text-lg transition-colors duration-200 relative group">
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              
            </div>
            
            <div className="flex items-center space-x-4">
              <p onClick={()=>navigate("/login")} className="font-medium text-[#2E1065] hover:text-violet-800 transition-colors duration-200">
                Log in
              </p>
              <button onClick={()=>navigate("/signup")} className="px-5 py-2.5 rounded-lg font-medium bg-white text-violet-800 border-2 border-violet-800 hover:bg-violet-50 transition-colors duration-200">
                Sign up
              </button>
              <button onClick={()=>navigate("/neighbor")} className="px-5 py-2.5 rounded-lg font-medium bg-violet-800 text-white hover:bg-violet-900 transition-colors duration-200 shadow-sm">
                Become a Neighbor
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#2E1065] focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2E1065] hover:bg-gray-50"
          >
            Services
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2E1065] hover:bg-gray-50"
          >
            How It Works
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2E1065] hover:bg-gray-50"
          >
            About Us
          </a>
          <div className="pt-4 pb-2 border-t border-gray-200">
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#2E1065]"
            >
              Log in
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#2E1065] bg-gray-50"
            >
              Sign up
            </a>
            <div className="mt-3 px-3">
              <button className="w-full px-4 py-2 rounded-md font-medium bg-violet-800 text-white hover:bg-violet-900 transition-colors duration-200">
                Become a Helper
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLanding;