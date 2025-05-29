import React, { useState } from 'react';
import signupImage from '../../assets/images/Team work-bro.png';
import SignupForm from '../../components/user/auth/SignupForm';
import LoginForm from '../../components/user/auth/LoginForm';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarLanding from '../../components/layout/Navbar-Landing';

const SignUpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';
  
  const handleLoginSuccess = () => navigate('/home');

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <>
          <NavbarLanding />
          <div className="w-full flex-grow flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex">
              <img
                src={signupImage}
                alt="Illustration of teamwork for signup"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
              {isLogin ? <LoginForm onLoginSuccess={handleLoginSuccess} /> : <SignupForm />}
            </div>
          </div>
        </>
      
    </div>
  );
};

export default SignUpPage;