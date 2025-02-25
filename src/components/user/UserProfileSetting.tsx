import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Grid, Switch } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';

interface UserProfileSettingsProps {
  user: {
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
    password?: string; // Optional for change password
  };
  onUpdate: (updatedUser: Partial<UserProfileSettingsProps['user']>) => void;
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [openAadhaarDialog, setOpenAadhaarDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ photo: e.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAadhaarVerify = () => {
    setOpenAadhaarDialog(true);
  };

  const confirmAadhaarVerify = () => {
    setFormData((prev) => ({ ...prev, aadhaarVerified: true }));
    onUpdate({ aadhaarVerified: true });
    setOpenAadhaarDialog(false);
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      onUpdate({ password: newPassword });
      setOpenPasswordDialog(false);
      setNewPassword('');
      setConfirmPassword('');
      alert('Password updated successfully!');
    } else {
      alert('Passwords do not match!');
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', borderRadius: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#2c3e50', fontWeight: 'bold' }}>
        User Profile
      </Typography>

      {/* Profile Photo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={formData.photo || undefined}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{ bgcolor: 'gray.200', '&:hover': { bgcolor: 'gray.300' } }}
        >
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handlePhotoUpload}
          />
          <PhotoCamera />
        </IconButton>
      </Box>

      {/* User Details */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ mr: 2, color: '#2c3e50' }}>Aadhaar Verified</Typography>
            <Switch
              checked={formData.aadhaarVerified}
              onChange={(e) => {
                if (!e.target.checked) handleAadhaarVerify();
                else setFormData((prev) => ({ ...prev, aadhaarVerified: true }));
              }}
              color="primary"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAadhaarVerify}
              disabled={formData.aadhaarVerified}
              sx={{ ml: 2 }}
            >
              Verify
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() => setOpenPasswordDialog(true)}
            sx={{ mt: 2, color: '#2c3e50', borderColor: '#2c3e50', '&:hover': { borderColor: '#1a252f', bgcolor: 'gray.100' } }}
          >
            Change Password
          </Button>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => onUpdate(formData)}
        sx={{ mt: 4, py: 1.5, fontSize: '1rem' }}
      >
        Save Changes
      </Button>

      {/* Aadhaar Verification Dialog */}
      <Dialog open={openAadhaarDialog} onClose={() => setOpenAadhaarDialog(false)}>
        <DialogTitle>Confirm Aadhaar Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to verify your Aadhaar? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAadhaarDialog(false)} sx={{ color: 'gray.600' }}>
            Cancel
          </Button>
          <Button onClick={confirmAadhaarVerify} color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} sx={{ color: 'gray.600' }}>
            Cancel
          </Button>
          <Button onClick={handlePasswordChange} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfileSettings;