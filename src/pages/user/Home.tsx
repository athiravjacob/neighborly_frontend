import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Hammer, Truck, Package, Wrench, Paintbrush } from 'lucide-react';
import Delivery from '../../assets/images/categories/delivery.jpg';
import Cleaning from '../../assets/images/categories/Cleaning.jpg';
import gardening from '../../assets/images/categories/gardening.jpg';
import handyman from '../../assets/images/categories/handyman.jpg';
import moving from '../../assets/images/categories/moving.jpg';
import drive from '../../assets/images/categories/drive.jpg';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../../redux/slices/authSlice';
import { logout } from '../../api/apiRequests';
import NavbarLanding from '../../components/layout/Navbar-Landing';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

interface ServiceCategory {
  name: string;
  icon: React.ReactNode;
  image: string;
  path: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    name: 'Home Repairs',
    icon: <Hammer size={32} className="text-violet-700" />,
    image: handyman,
    path: '/create-task',
  },
  {
    name: 'Moving Help',
    icon: <Truck size={32} className="text-violet-700" />,
    image: moving,
    path: '/create-task',
  },
  {
    name: 'Cleaning',
    icon: <Package size={32} className="text-violet-700" />, // Replace with cleaning icon
    image: Cleaning,
    path: '/create-task',
  },
  {
    name: 'Delivery',
    icon: <Package size={32} className="text-violet-700" />,
    image: Delivery,
    path: '/create-task',
  },
  {
    name: 'Assembly',
    icon: <Wrench size={32} className="text-violet-700" />,
    image: drive,
    path: '/create-task',
  },
  {
    name: 'Painting',
    icon: <Paintbrush size={32} className="text-violet-700" />,
    image: gardening,
    path: '/create-task',
  },
];

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return; // Prevent empty searches
    navigate(`/create-task`);
  };

  

  

  return (
    <>
      <NavbarLanding />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-6">
            Welcome to Neighborly!
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Hey {user?.name?.split(' ')[0] || 'Neighbor'}, Let me know how I can assist!
          </p>
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
            aria-label="Search for services"
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
          </form>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-violet-900 text-center mb-12">
            Browse Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category) => (
              <Card
                key={category.name}
                to={category.path}
                imageSrc={category.image}
                imageAlt={category.name}
                title={category.name}
                icon={category.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;