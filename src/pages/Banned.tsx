import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AccountBanned = () => {
  const handleLogout = () => {
    // Clear tokens/session and redirect to login
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-14 h-14 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Account Banned</h1>
        <p className="text-gray-600 mb-6">
          Your account has been blocked by the administrator. Please contact support for more information.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountBanned;
