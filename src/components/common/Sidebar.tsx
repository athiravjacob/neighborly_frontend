import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import MessageIcon from '@mui/icons-material/Message';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Define the User interface to match Home.tsx
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

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  user: User; // Updated to match the User interface from Home.tsx
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onNavigate, user }) => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    // Simulate logout (clear user data, redirect to login)
    console.log('User logged out');
    navigate('/login'); // Redirect to login page
    setOpenLogoutDialog(false);
    onClose(); // Close sidebar after logout
  };

  const handleNavigateInternal = (path: string) => {
    onNavigate(path);
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/home' },
    { text: 'My Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { text: 'Wallet', icon: <AccountBalanceWalletIcon />, path: '/wallet' },
    { text: 'Payment', icon: <PaymentIcon />, path: '/payment' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 240 }, // Full width on mobile, 240px on desktop
            bgcolor: '#f5f7fa', // Light gray background
            boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            Menu
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#2c3e50' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          {user.photo && (
            <img src={user.photo} alt="User Profile" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          )}
          <Typography variant="subtitle1" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
            {user.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray.600' }}>
            {user.email}
          </Typography>
        </Box>

        {/* Navigation Items */}
        <List sx={{ p: 0 }}>
          {navigationItems.map((item) => (
            <ListItem
              key={item.text}
              component="button" // Explicitly specify ListItem as a button
              onClick={() => handleNavigateInternal(item.path)}
              sx={{ '&:hover': { bgcolor: 'gray.100' } }} // Hover styling
            >
              <ListItemIcon sx={{ color: '#2c3e50' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: '#2c3e50' }} />
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{ borderColor: 'red.400', color: 'red.600', '&:hover': { borderColor: 'red.600', bgcolor: 'red.50' } }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out of Neighborly?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} sx={{ color: 'gray.600' }}>
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error" sx={{ color: 'red.600' }}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;