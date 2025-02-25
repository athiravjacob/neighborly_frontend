import React from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Placeholder for Google icon
import { useLogin } from '../hooks/useLogin';

const LoginPage: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useLogin();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 480, // Matches the signup form width for consistency
        mx: 'auto',
        p: 4,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
        Login to Neighborly
      </Typography>

      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ py: 1.5, fontSize: '1rem' }}
      >
        Login
      </Button>

      <Button
        variant="outlined"
        startIcon={<AccountCircleIcon />} // Placeholder; use a Google icon or custom logo later
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: '1rem',
          borderColor: 'gray.400',
          color: 'gray.700',
          '&:hover': { borderColor: 'gray.600', color: 'gray.900' },
        }}
        onClick={() => console.log('Google login')}
      >
        Login with Google
      </Button>

      <Typography align="center" sx={{ mt: 2, color: 'gray.600' }}>
        Don’t have an account?{' '}
        <Link href="/signup" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          Sign up
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;