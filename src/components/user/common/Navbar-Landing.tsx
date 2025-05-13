import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { User } from 'lucide-react'; // assuming you're using lucide-react icons
import { logout } from '../../../api/apiRequests';
import { clearCredentials } from '../../../redux/slices/authSlice';
import { showTasks } from '../../../api/taskApiRequests';

const NavbarLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
    logout()
    navigate('/');
  };
  async function FetchTasks() {
    await showTasks(user?.id!)
    navigate("/home/taskList")
  }

  // 🔹 If user is NOT authenticated
  if (!isAuthenticated || user?.type === 'neighbor') {
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#2E1065]" onClick={() => navigate("/")}>
                Neighborly
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {/* <a href="#" className="text-gray-600 hover:text-[#2E1065] font-medium text-lg">
                Services
              </a> */}

              <p onClick={() => navigate("/login")} className="font-medium text-[#2E1065] hover:text-violet-800 cursor-pointer">
                Log in
              </p>
              <button onClick={() => navigate("/signup")} className="px-5 py-2.5 rounded-lg font-medium bg-white text-violet-800 border-2 border-violet-800 hover:bg-violet-50">
                Sign up
              </button>
              <button onClick={() => navigate("/neighbor")} className="px-5 py-2.5 rounded-lg font-medium bg-violet-800 text-white hover:bg-violet-900">
                Become a Neighbor
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
                {isMenuOpen ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
            <a href="#" className="block px-3 py-2 text-base text-gray-700 hover:text-[#2E1065]">Services</a>
            <a href="#" className="block px-3 py-2 text-base text-gray-700 hover:text-[#2E1065]">How It Works</a>
            <a href="#" className="block px-3 py-2 text-base text-gray-700 hover:text-[#2E1065]">About Us</a>
            <div className="pt-4 pb-2 border-t border-gray-200">
              <p onClick={() => navigate("/login")} className="block px-3 py-2 text-base text-[#2E1065] cursor-pointer">Log in</p>
              <p onClick={() => navigate("/signup")} className="block px-3 py-2 text-base text-[#2E1065] bg-gray-50 cursor-pointer">Sign up</p>
              <div className="mt-3 px-3">
                <button onClick={() => navigate("/neighbor")} className="w-full px-4 py-2 bg-violet-800 text-white rounded-md">
                  Become a Neighbor
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // If user logged in

  return (
    <nav className="flex items-center justify-between p-6 bg-white shadow-sm border-b border-violet-100">
      <div className="text-2xl font-bold text-violet-900 cursor-pointer" onClick={() => navigate("/")}>
        Neighborly
      </div>
      <div className="flex items-center gap-6">
        {/* <Link to="/home/kyc" className="text-violet-700 hover:text-violet-900">Services</Link> */}
        <div   onClick={FetchTasks} className="text-violet-700 hover:text-violet-900 hover:cursor-default cursor-pointer">Tasks</div>
        <div className="relative group p-2">
  <p className="flex items-center gap-2 text-violet-700 hover:text-violet-900 cursor-pointer">
    <User size={20} />
  </p>
  <div
    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none group-hover:pointer-events-auto z-50"
  >
    <div className="py-1">
      <p className="block px-4 py-2 text-sm text-black">Hi, {user?.name?.split(' ')[0]}</p>
      <p
        onClick={() => navigate("/home/settings")}
        className="block px-4 py-2 text-sm text-violet-700 hover:bg-violet-100"
      >
        Settings
      </p>
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-violet-700 hover:bg-violet-100"
      >
        Logout
      </button>
    </div>
  </div>
</div>
      </div>
    </nav>
  );
};

export default NavbarLanding;
