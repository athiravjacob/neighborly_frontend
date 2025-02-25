import React from 'react';
import { AppBar, Toolbar, Box, Typography, TextField, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NeighborlyLogo from '../../assets/Neighborly.png'; // Adjust path as needed

interface NavbarProps {
  onSidebarToggle: () => void;
  location: string;
  onLocationChange: (location: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle, location, onLocationChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use OpenStreetMap's Nominatim API (free) to convert coords to address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.display_name) {
                onLocationChange(data.display_name);
              }
            })
            .catch((error) => console.error('Error fetching location:', error));
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to detect location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#2c3e50', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src={NeighborlyLogo} alt="Neighborly Logo" style={{ width: 40, height: 40 }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            Neighborly
          </Typography>
        </Box>

        {/* Search and Location - Desktop Layout */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'gray.500', mr: 1 }} />
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': { height: 40 },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <LocationOnIcon sx={{ color: 'gray.500', mr: 1 }} />
                ),
                endAdornment: (
                  <IconButton onClick={handleLocationDetect} size="small" sx={{ p: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                      Detect
                    </Typography>
                  </IconButton>
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': { height: 40 },
              }}
            />
          </Box>
        )}

        {/* Sidebar Toggle */}
        <IconButton
          onClick={onSidebarToggle}
          sx={{ color: 'white', p: 1 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search and Location - Mobile Layout */}
        {isMobile && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'gray.500', mr: 1 }} />
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                mb: 1,
                '& .MuiOutlinedInput-root': { height: 40 },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <LocationOnIcon sx={{ color: 'gray.500', mr: 1 }} />
                ),
                endAdornment: (
                  <IconButton onClick={handleLocationDetect} size="small" sx={{ p: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                      Detect
                    </Typography>
                  </IconButton>
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': { height: 40 },
              }}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;