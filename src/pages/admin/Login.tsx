// src/pages/AdminLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/adminApiRequests';
import { setCredentials } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminLogin(email, password);
      const adminDetails = {id:response.id,name:response.name,email:response.email,type:response.type}
      dispatch(setCredentials({user:adminDetails}))      
      navigate('/admin/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Logo/Branding */}
        <div className="flex justify-center mb-6">
          <div className="text-3xl font-bold text-white">Neighborly</div>
          {/* Replace with your logo if you have one */}
          {/* <img src="/path-to-logo.png" alt="Neighborly" className="h-12" /> */}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Admin Login</h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;