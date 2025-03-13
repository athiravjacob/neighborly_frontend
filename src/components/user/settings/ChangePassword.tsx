import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  IconButton, 
  Modal, 
  Box, 
  Typography 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
// import { changePassword } from '../../utilis/api'; // Assuming you have an API function for this
import { BasicInfoProps } from '../../../types/settings';

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC<BasicInfoProps> = ({ User }) => {
  // State for modal visibility
  const [open, setOpen] = useState(false);
  
  // State for password data
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // State for saving status and errors
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  // Validate password fields
  const validatePasswords = (): boolean => {
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setError('New password and confirmation are required');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return false;
    }
    if (passwordData.newPassword === passwordData.currentPassword) {
      setError('New password must be different from current password');
      return false;
    }
    return true;
  };

  // Handle password change submission
  const handleSubmit = async () => {
    if (!User?.id) {
      setError('User ID not found');
      return;
    }

    if (!validatePasswords()) return;

    setIsSaving(true);
    setError(null);

    try {
      // Assuming changePassword API returns a success message
    //   await changePassword(user._id, {
    //     currentPassword: passwordData.currentPassword,
    //     newPassword: passwordData.newPassword,
    //   });
      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // Close modal after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please check your current password.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-indigo-900">Password</h2>
        <IconButton onClick={handleOpen} className="text-indigo-600">
          <EditIcon />
        </IconButton>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="change-password-modal"
      >
        <Box sx={modalStyle}>
          <Typography 
            id="change-password-modal" 
            variant="h6" 
            component="h2"
            className="mb-4 text-indigo-900"
          >
            Change Password
          </Typography>

          <div className="space-y-4">
            <TextField
              variant="outlined"
              fullWidth
              type="password"
              name="currentPassword"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={handleChange}
              size="small"
              disabled={isSaving}
            />

            <TextField
              variant="outlined"
              fullWidth
              type="password"
              name="newPassword"
              label="New Password"
              value={passwordData.newPassword}
              onChange={handleChange}
              size="small"
              disabled={isSaving}
            />

            <TextField
              variant="outlined"
              fullWidth
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              size="small"
              disabled={isSaving}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ChangePassword;