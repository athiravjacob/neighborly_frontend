import React, { useState } from 'react';
import signupImage from '../../assets/Team work-bro.png';
import SignupForm from '../../components/user/auth/SignupForm';
import LoginForm from '../../components/user/auth/LoginForm';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarLanding from '../../components/user/common/Navbar-Landing';
// import Loader from '../../components/ui/loader';

const SignUpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false); // New state to track login completion

  // Callback to handle login success
  const handleLoginSuccess = () => {
    setShowLoader(true);
    setHasLoggedIn(true); // Mark login as complete
    setTimeout(() => {
      setShowLoader(false);
      navigate('/home');
    }, 2000); // Show loader for 1 minute
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {showLoader ? (
        <div className='m-auto bg-gray-100'>
          {/* <Loader></Loader> */}
        </div>
      ): hasLoggedIn ? null : ( // If login is complete but loader is off, show nothing until navigation
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
      )}
    </div>
  );
};

export default SignUpPage;