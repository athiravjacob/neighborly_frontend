import React from 'react';
import signupImage from '../../assets/Team work-bro.png';
import SignupForm from '../../components/user/auth/SignupForm';
import LoginForm from '../../components/user/auth/LoginForm';
import { useLocation } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  const location = useLocation()
  const isLogin = location.pathname=== '/login'

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <h1 className="text-4xl font-bold text-violet-950 pt-6 pl-6">Neighborly</h1>
      <div className="w-full flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex">
          <img
            src={signupImage}
            alt="Illustration of teamwork for signup"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
          {isLogin ? <LoginForm/>:<SignupForm/>}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;