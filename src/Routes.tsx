// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/user/SignUp';
import HomePage from './pages/user/Home';
import Profile from './pages/user/Main/Profile';
import Settings from './pages/user/Main/Settings';
import ProtectedRoutes from './components/user/common/ProtectedRoutes';
import AdminLogin from './pages/admin/Login';
import Home from './pages/admin/AdminHome';
import ProtectedRoutes_admin from './components/admin/common/ProtectedRoutes-admin';
import UserList from './pages/admin/Main/UserList';
import UserDetails from './pages/admin/Main/UserDetailedView';
import { ForgotPassword } from './components/user/auth/ForgotPassword';
import { ResetPassword } from './components/user/auth/ResetPassword';
import LandingPage from './pages/user/LandingPage';
import TaskCreationPage from './pages/user/TaskCreationPage';
import BecomeANeighbor from './pages/neighbor/BecomeNeighborPage';
import Calendar from './pages/neighbor/Calendar';
import NeighborHome from './pages/neighbor/Neighbor-home';
import CompleteYourProfile from './pages/neighbor/CompleteProfile';
import TaskListPage from './components/user/task/ListTask';
import SettingsPage from './pages/user/SettingsPage';
import KYCProcess from './pages/user/Kyc';
// import NeighborProfile from './pages/neighbor/Profile';
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<SignUpPage />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/reset-password" element={<ResetPassword />} /> 
      <Route path="/create-task" element={<TaskCreationPage />} /> 
      <Route path="/neighbor" element={<BecomeANeighbor />}/>   
      
      <Route path="/neighbor/home" element={<NeighborHome/>}></Route>
      <Route path="/neighbor/complete-your-profile" element={<CompleteYourProfile/>}></Route>
      {/* <Route path="/neighbor/profile" element={<NeighborProfile/>}></Route> */}

      <Route path="/" element={<LandingPage />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/home/taskList" element={<TaskListPage />} />
        <Route path="/home/settings" element={<SettingsPage />} />
        <Route path="/home/kyc" element={<KYCProcess />} />


    
      </Route>


      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route element={<ProtectedRoutes_admin />}>
        <Route path="/admin/dashboard" element={<Home />}>
          <Route path="users" element={<UserList />} />
          <Route path="users/details" element={<UserDetails />} />

          
        </Route>
      </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          
        
    </Routes>

   
  );
};

export default AppRoutes;