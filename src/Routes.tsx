// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/user/SignUp';
import HomePage from './pages/user/Home';
import TaskList from './pages/user/Main/Tasks';
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

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<SignUpPage />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/resetPassword" element={<ResetPassword />} /> 
      <Route path="/create-task" element={<TaskCreationPage />} /> 
      <Route path="/become-a-neighbor" element={<BecomeANeighbor />} /> 

      BecomeANeighbor

      <Route path="/" element={<LandingPage />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<HomePage />}>
          <Route path="task-list" element={<TaskList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="" element={<TaskList />} /> {/* Default child route */}
        </Route>
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