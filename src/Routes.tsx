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

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<SignUpPage />} /> 
      <Route path="/" element={<SignUpPage />} />

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
          <Route path="/" element={<AdminLogin />} />

      {/* Add more admin routes later, e.g., /admin/dashboard */}
    </Routes>
  );
};

export default AppRoutes;