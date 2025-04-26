import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { UserProfile } from '../../../types/settings';
import { useProfileSettings } from '../../../hooks/useProfileSettings';

interface GeneralProps {
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const General = ({ setSuccessMessage, setErrorMessage }: GeneralProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userDetails, isLoading, error, updateProfile, isUpdating, updateError } = useProfileSettings(user?.id!);

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '',
    dob: '',
    profilePicture: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (userDetails) {
      console.log('User details loaded:', userDetails);
      const formattedDob = userDetails.dob
        ? new Date(userDetails.dob).toISOString().split('T')[0]
        : '';
      setProfile({
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone || '',
        dob: formattedDob,
        profilePicture: userDetails.profilePicture || null,
      });
      setPreviewImage(userDetails.profilePicture || null);
    }
  }, [userDetails]);

  useEffect(() => {
    if (error) {
      console.error('Profile fetch error:', error);
      setErrorMessage('Failed to load profile data.');
    }
    if (updateError) {
      console.error('Profile update error:', updateError);
      setErrorMessage('Failed to update profile.');
    }
  }, [error, updateError, setErrorMessage]);

  useEffect(() => {
    console.log('isUpdating state:', isUpdating);
  }, [isUpdating]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    if (userDetails) {
      setProfile({
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone || '',
        dob: userDetails.dob ? new Date(userDetails.dob).toISOString().split('T')[0] : '',
        profilePicture: userDetails.profilePicture || null,
      });
      setPreviewImage(userDetails.profilePicture || null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    console.log('Submitting profile update...');

    try {
      const updatedProfile: UserProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        dob: profile.dob,
        profilePicture: previewImage === null ? null : profile.profilePicture,
      };

      const file = fileInputRef.current?.files?.[0];
      console.log('Profile to update:', updatedProfile, 'File selected:', !!file);
      await updateProfile(updatedProfile, file); 
      // setSuccessMessage('Profile updated successfully!');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setErrorMessage('Failed to update profile.');
    }
  };

  return (
    <div className="p-6 relative">
      {(isLoading || isUpdating) && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex flex-col items-center justify-center z-10">
          <svg
            className="animate-spin h-8 w-8 text-violet-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-sm text-gray-700">{isUpdating ? 'Updating Profile...' : 'Loading Profile...'}</p>
        </div>
      )}
      <form onSubmit={handleProfileSubmit} role="form" aria-label="Profile settings form">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">Profile Information</h2>
          <p className="text-sm text-gray-600">Update your personal information and how others see you on our platform</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center">
            <div
              className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer relative border-2 border-violet-200 hover:border-violet-500"
              onClick={handleProfilePictureClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProfilePictureClick();
                }
              }}
              role="button"
              tabIndex={0}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={`${profile.name}'s profile picture`}
                  className="h-full w-full object-cover"
                  onError={() => setPreviewImage(null)}
                />
              ) : (
                <svg
                  className="h-12 w-12 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
              <div className="absolute flex items-center justify-center transition-opacity">
                <svg
                  className="h-8 w-8 text-white opacity-0 hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading || isUpdating}
            />
            <div className="ml-5">
              <button
                type="button"
                className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                onClick={handleProfilePictureClick}
                disabled={isLoading || isUpdating}
              >
                Change
              </button>
              {previewImage && (
                <button
                  type="button"
                  className="ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  onClick={() => setPreviewImage(null)}
                  disabled={isLoading || isUpdating}
                >
                  Remove
                </button>
              )}
              <p className="mt-2 text-sm text-gray-500">Click to upload. JPG, GIF, PNG. 1MB max.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                value={profile.name}
                disabled
                className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={profile.email}
                disabled
                className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                type="tel"
                name="phone"
                id="phone"
                autoComplete="tel"
                value={profile.phone}
                onChange={handleProfileChange}
                className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={isLoading || isUpdating}
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="dob"
                id="dob"
                value={profile.dob}
                onChange={handleProfileChange}
                className="shadow-sm focus:ring-violet-500 focus:border-violet-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={isLoading || isUpdating}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={resetForm}
              disabled={isLoading || isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-900 hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              disabled={isLoading || isUpdating}
            >
              {isUpdating ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default General;
