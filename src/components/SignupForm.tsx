import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Link,
  Typography,
  InputAdornment,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import { useSignUp } from '../hooks/useSignUp';

const SignupForm: React.FC = () => {
  const {
    formData,
    showOtpField,
    handleChange,
    handleSendOtp,
    handleVerifyOtp,
  } = useSignUp();
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add signup logic here
    console.log('Form submitted:', formData);
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Create Account
      </Typography>
  
      <TextField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        fullWidth
      />
  
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
        fullWidth
      />
  
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        InputProps={{
          endAdornment: formData.email && isEmailValid && (
            <InputAdornment position="end">
              <Link
                component="button"
                type="button"
                onClick={handleSendOtp}
                disabled={showOtpField}
                sx={{ textDecoration: 'none' }}
              >
                Send OTP
              </Link>
            </InputAdornment>
          ),
        }}
      />
  
      {showOtpField && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => handleVerifyOtp(otp)}
            sx={{ minWidth: 100 }}
          >
            Verify
          </Button>
        </Box>
      )}
  
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        fullWidth
      />
  
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        fullWidth
      />
  
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={
          !formData.fullName ||
          !formData.phone ||
          !formData.email ||
          !formData.password ||
          formData.password !== formData.confirmPassword
        }
      >
        Sign Up
      </Button>
  
      <Button
        variant="outlined"
        startIcon={<GoogleIcon />}
        sx={{ mt: 1 }}
        onClick={() => console.log('Google signup')}
      >
        Sign up with Google
      </Button>
    </Box>
  );
};

export default SignupForm;