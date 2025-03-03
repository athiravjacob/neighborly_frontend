// ProfileHeader.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ProfileHeaderProps {
  name: string;
  role: string;
  timezone: string;
  initialImage?: string;
  onImageChange?: (image: string | null) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  role,
  timezone,
  initialImage = null,
  onImageChange,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(initialImage);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setProfileImage(result);
        if (onImageChange) {
          onImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-indigo-900">User Profile</h1>
        <div className="flex space-x-2">
          <Button 
            variant="contained" 
            disableElevation 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => profileInputRef.current?.click()}
          >
            Upload New Profile
          </Button>
          <Button 
            variant="outlined" 
            className="border-gray-300 text-gray-600"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="flex-shrink-0">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <CloudUploadIcon fontSize="large" />
                  <span className="text-xs mt-1">Upload Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={profileInputRef}
              onChange={handleProfileUpload}
              className="hidden"
              accept="image/*"
            />
            <button 
              onClick={() => profileInputRef.current?.click()}
              className="absolute inset-0 w-full h-full rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <CloudUploadIcon className="text-white" />
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <div className="text-lg font-medium">
            {name}
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {role}
          </div>
          <div className="text-xs text-gray-400">
            {timezone}
          </div>
        </div>
      </div>
      
      <input
        type="file"
        ref={profileInputRef}
        onChange={handleProfileUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ProfileHeader;