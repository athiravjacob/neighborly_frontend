import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { changePassword_neighbor } from '../../api/neighborApiRequests';
import { toast } from 'react-toastify';


interface GeneralProps {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setActiveSection: React.Dispatch<React.SetStateAction<string>>;

  }
  
export const PasswordSettings = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const { user } = useSelector((state: RootState) => state.auth);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
      };
    
    
    
      const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       
    
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error('New passwords do not match.');
          return;
        }
    
          try {
            const passwordchanged = await changePassword_neighbor(user?.id!, passwordData.currentPassword, passwordData.newPassword)
            if ( passwordchanged) {
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              })
              toast.success("Password updated successfully")
            }else toast.error("Password couldn't update .Current password should be valid ")
          
        } catch (error) {
          toast.error('Failed to change password. Please try again.');
          console.error('Error changing password:', error);
        }
      };
  return (
    <div className="p-6">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-1">Change Password</h2>
                    <p className="text-sm text-gray-600">Ensure your account is using a strong, secure password</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Must be at least 8 characters and include a number and a special character.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full  border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-900 hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
  )
}

export default PasswordSettings