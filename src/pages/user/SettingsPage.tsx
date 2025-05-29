import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NavbarLanding from '../../components/layout/Navbar-Landing';
import { RootState } from '../../redux/store';
import { useProfileSettings } from '../../hooks/useProfileSettings';
import { uploadImageToCloudinary } from '../../utilis/UploadImageTocloudinary';
import General from '../../components/user/settings/General';
import Security from '../../components/user/settings/Security';




const SettingsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  

  

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSection, setActiveSection] = useState('general');

  

 

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLanding />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your profile and account preferences</p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                    activeSection === 'general'
                      ? 'border-violet-900 text-violet-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveSection('general')}
                >
                  General
                </button>
                <button
                  className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                    activeSection === 'security'
                      ? 'border-violet-900 text-violet-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveSection('security')}
                >
                  Security
                </button>
              </nav>
            </div>

            {successMessage && (
              <div className="mx-6 mt-6 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {(errorMessage ) && (
              <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage  || 'An error occurred'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'general' && (
              <General setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
            )}

            {activeSection === 'security' && (
              <Security setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} setActiveSection={setActiveSection} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;