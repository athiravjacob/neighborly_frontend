// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/user/SignUp';
import HomePage from './pages/user/Home';

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
import NeighborHome from './pages/neighbor/Neighbor-home';
import CompleteYourProfile from './pages/neighbor/CompleteProfile';
import TaskListPage from './components/user/task/ListTask';
import SettingsPage from './pages/user/SettingsPage';
import NeighborList from './pages/admin/Main/NeighborList';
import NeighborDetails from './pages/admin/Main/NeighborDetailedView';
import TaskList from './pages/admin/Main/TaskList';
import { PaymentPage } from './pages/user/PaymentPage';
import { PaymentSuccess } from './pages/user/PaymentSuccess';
import AccountBanned from './pages/Banned';
import DisputeList from './pages/admin/Main/DisputeList';
import DisputeDetails from './pages/admin/Main/DisputeDetailedView';
import TransactionsList from './pages/admin/Main/TransactionsList';
import { Dashboard } from './pages/admin/Main/Dashboard';
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
      <Route path="/neighbor" element={<BecomeANeighbor />} />  
      <Route path="/banned" element={<AccountBanned/>}/>
      
      <Route path="/neighbor/home" element={<NeighborHome/>}></Route>
      <Route path="/neighbor/complete-your-profile" element={<CompleteYourProfile/>}></Route>
      {/* <Route path="/neighbor/profile" element={<NeighborProfile/>}></Route> */}

      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/message" element={<Chat />} /> */}


      {/* Protected User Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/home/taskList" element={<TaskListPage />} />
        <Route path="/home/settings" element={<SettingsPage />} />
        {/* <Route path="/home/kyc" element={<KYCProcess />} /> */}
        <Route path="/payment/:taskId" element={<PaymentPage />} />
        <Route path='/payment_success' element={<PaymentSuccess/>}/>
    
      </Route>


      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route element={<ProtectedRoutes_admin />}>
        <Route path="/admin/home" element={<Home />}>
          <Route path = "dashboard" element={<Dashboard/>}/>
          <Route path="users" element={<UserList />} />
          <Route path="users/details" element={<UserDetails />} />
          <Route path="neighbors" element={<NeighborList />} />
          <Route path="neighbors/details" element={<NeighborDetails />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="disputes" element={<DisputeList />} />
          <Route path="disputes/details" element={<DisputeDetails />} />
          <Route path="transactions" element={<TransactionsList />} />
          {/* <Route path="disputes/details" element={<DisputeDetails />} /> */}



          
        </Route>
      </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          
        
    </Routes>

   
  );
};

export default AppRoutes;