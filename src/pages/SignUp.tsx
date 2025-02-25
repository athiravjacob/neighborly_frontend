import React from 'react';
import { Container, Paper } from '@mui/material';
import SignupForm from '../components/SignupForm';


const SignupPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>

      <Paper elevation={4} sx={{ p: 2 }}>
       <SignupForm />
        
      </Paper>
    </Container>
  );
};

export default SignupPage;