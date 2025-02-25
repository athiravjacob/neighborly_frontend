import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import UserProfileSettings from '../components/user/UserProfileSetting';
import { useNavigate } from 'react-router-dom';

interface User {
  photo?: string;
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  aadhaarVerified: boolean;
  bio: string;
  street: string;
  city: string;
  state: string;
  password?: string;
}

const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState(''); // State for location field
  const [activeSection, setActiveSection] = useState<'home' | 'settings'>('home'); // Manage main content
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleNavigate = (path: string) => {
    if (path === '/settings') {
      setActiveSection('settings');
    } else if (path === '/home' || path === '/') {
      setActiveSection('home');
    }
    navigate('/home'); // Always navigate to /home, handle content internally
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  // Mock user data (replace with real data from Context or API later)
  const mockUser: User = {
    photo: '/path/to/user-photo.jpg', // Adjust path as needed
    fullName: 'Alaa Mohamed',
    dob: '1990-01-01',
    email: 'alaa@example.com',
    phone: '+1234567890',
    aadhaarVerified: false,
    bio: 'Community enthusiast and neighborly helper.',
    street: '123 Main St',
    city: 'Cairo',
    state: 'Egypt',
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    console.log('User updated:', updatedUser);
    // Update mockUser or use Context/State management to persist changes
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar
        onSidebarToggle={handleSidebarToggle}
        location={location}
        onLocationChange={handleLocationChange}
      />

      {/* Main Layout: Sidebar and Content */}
      <Box sx={{ display: 'flex', flex: 1, mt: 8 }}> {/* Offset for fixed navbar */}
        {/* Sidebar */}
        <Sidebar
          open={isSidebarOpen}
          onClose={handleSidebarToggle}
          onNavigate={handleNavigate}
          user={mockUser} // Pass mock user data
        />

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, p: 3, bgcolor: '#f5f7fa' }}>
          {activeSection === 'home' ? (
            <>
              <Typography variant="h4" align="center" sx={{ mt: 4, color: '#2c3e50' }}>
                Welcome to Neighborly!
              </Typography>
              <Typography variant="body1" align="center" sx={{ mt: 2, color: 'gray.600' }}>
                Select an option from the sidebar to get started.
              </Typography>
            </>
          ) : (
            <UserProfileSettings user={mockUser} onUpdate={handleUpdateUser} />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;