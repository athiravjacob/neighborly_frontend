import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, User, Hammer, Truck, Package, Wrench, Paintbrush } from "lucide-react";
import Delivery from "../../assets/categories/delivery.jpg";
import Cleaning from "../../assets/categories/Cleaning.jpg";
import Gardening from "../../assets/categories/gardening.jpg";
import handyman from "../../assets/categories/handyman.jpg";
import moving from "../../assets/categories/moving.jpg";
import drive from "../../assets/categories/drive.jpg";
import { RootState, persistor } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../redux/slices/authSlice";
import { logout } from "../../api/apiRequests";
import NavbarLanding from "../../components/user/common/Navbar-Landing";


// Sample service categories with images
const serviceCategories = [
  {
    name: "Home Repairs",
    icon: <Hammer size={32} className="text-violet-700" />,
    image: handyman, 
    path: "/create-task",
  },
  {
    name: "Moving Help",
    icon: <Truck size={32} className="text-violet-700" />,
    image: moving, 
    path: "/create-task",
  },
  {
    name: "Cleaning",
    icon: <Truck size={32} className="text-violet-700" />, 
    image: Cleaning, 
    path: "/create-task", 
  },
  {
    name: "Delivery",
    icon: <Package size={32} className="text-violet-700" />,
    image: Delivery,
    path: "/create-task",
  },
  {
    name: "Assembly",
    icon: <Wrench size={32} className="text-violet-700" />,
    image: drive,
    path: "/create-task",
  },
  {
    name: "Painting",
    icon: <Paintbrush size={32} className="text-violet-700" />,
    image: Gardening ,
    path: "/create-task",
  },
];

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Mumbai, IN");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Add search logic here (e.g., redirect to a search results page with query)
    console.log("Search query:", searchQuery, "Location:", location);
    navigate(`/create-task?query=${searchQuery}&location=${location}`);
  };

  const handleLogout = async () => {
    
    dispatch(clearCredentials());
    await persistor.purge(); 
    await logout()
    navigate("/signup");
  };

  return (
    
    <>
      <NavbarLanding/>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-6">
            Welcome to Neighborly!
          </h1>
          <p className="text-xl text-gray-600 mb-10">Hey {user?.name.split(' ')[0]} ,Let me know how I can assist!</p>

          {/* Search Bar and Location Selector */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a service (e.g., furniture assembly, cleaning)"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-violet-700 hover:text-violet-900"
              >
                <Search size={24} />
              </button>
            </div>
            {/* <div className="flex items-center gap-2">
              <MapPin size={20} className="text-violet-700" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                <option value="Mumbai, IN">Mumbai, IN</option>
                <option value="Delhi, IN">Delhi, IN</option>
                <option value="Bangalore, IN">Bangalore, IN</option>
                <option value="Chennai, IN">Chennai, IN</option>
                <option value="Kolkata, IN">Kolkata, IN</option>
              </select>
            </div> */}
          </form>
        </div>
      </section>

      {/* Browse Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-violet-900 text-center mb-12">
            Browse Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-lg font-semibold">Book Now</span>
                  </div>
                </div>
                <div className="p-6 flex items-center gap-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-violet-900">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ >
      
  );
};

export default HomePage;






















// import MainContent from "../../components/user/common/MainContent";
// import Navbar from "../../components/user/common/Navbar";
// import Sidebar from "../../components/user/common/Sidebar";



// const Home: React.FC = () => {
  

//   return (
//     <div className="min-h-screen py-14  bg-gray-50">
//       <Navbar />
//       <Sidebar />
//       <MainContent/>
      

      
//     </div>
//   );
// };

// export default Home;




