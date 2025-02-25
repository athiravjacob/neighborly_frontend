import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel, Container, Grid } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

// Define the User interface to match other components
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

interface SettingsProps {
  user: User;
  onSave: (updatedSettings: Partial<User>) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ user, onSave }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    dataSharing: false,
    newPassword: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name === 'emailNotifications' || name === 'smsNotifications' || name === 'dataSharing' ? checked : value,
    }));
  };

  const handlePasswordChange = () => {
    if (settings.newPassword === settings.confirmPassword) {
      onSave({ password: settings.newPassword });
      setSettings((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
      alert('Password updated successfully!');
    } else {
      alert('Passwords do not match!');
    }
  };

  const handleSave = () => {
    onSave({
      email: settings.emailNotifications ? user.email : '', // Mock update for notifications
      phone: settings.smsNotifications ? user.phone : '', // Mock update for SMS
      // Add other settings updates as needed
    });
    alert('Settings saved successfully!');
  };

  return (
    <Container maxWidth="lg" sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: 'calc(100vh - 64px)', mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#2c3e50', fontWeight: 'bold' }}>
        Settings
      </Typography>

      <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50' }}>
          Account Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => {
                setSettings((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
              }}
              sx={{
                mb: 2,
                color: '#2c3e50',
                borderColor: '#2c3e50',
                '&:hover': { borderColor: '#1a252f', bgcolor: 'gray.100' },
              }}
            >
              Change Password
            </Button>
          </Grid>
          {settings.newPassword && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={settings.newPassword}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={settings.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePasswordChange}
                  sx={{ mb: 2 }}
                >
                  Save Password
                </Button>
              </Grid>
            </>
          )}
        </Grid>

        <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#2c3e50' }}>
          Notification Preferences
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  name="emailNotifications"
                  color="primary"
                />
              }
              label="Email Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={handleChange}
                  name="smsNotifications"
                  color="primary"
                />
              }
              label="SMS Notifications"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#2c3e50' }}>
          Privacy Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dataSharing}
                  onChange={handleChange}
                  name="dataSharing"
                  color="primary"
                />
              }
              label="Allow Data Sharing"
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 4, py: 1.5, fontSize: '1rem' }}
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsPage;