import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import UploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImageToCloudinary } from '../../../utilis/UploadImageTocloudinary';
import { verifyId } from '../../../api/apiRequests';
import { BasicInfoProps } from '../../../types/settings';

const VerifygovtId: React.FC<BasicInfoProps> = ({ User }) => {
  const [govtIdNumber, setgovtIdNumber] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(User?.isVerified ?? false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      setgovtIdNumber(value);
      setError('');
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setError('');
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
      setImageFile(null);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      let image: string | null = null;
      if (imageFile) {
        image = await uploadImageToCloudinary(imageFile, setError);
      }
      if (!image) {
        setError('Image upload failed');
        setIsLoading(false);
        return;
      }

      const result = await verifyId(govtIdNumber, image);
      if (result) {
        setIsVerified(true);
      } else {
        setError('Verification failed. Please check your details and try again.');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-indigo-900">Verify ID</h2>
        </div>
        <div className="text-green-600 font-medium">ID Verified</div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-indigo-900">Verify ID </h2>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Id Number
            </label>
            <TextField
              variant="outlined"
              fullWidth
              name="govtIdNumber"
              value={govtIdNumber}
              onChange={handleNumberChange}
              placeholder="Enter 12-digit govtId number"
              size="small"
              inputProps={{ maxLength: 12 }}
              error={!!error && govtIdNumber.length > 0}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Identity Card
            </label>
            <div className="flex items-center gap-4">
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                className="text-indigo-600 border-indigo-600"
                disabled={isLoading}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </Button>
              {selectedImage && (
                <IconButton
                  onClick={handleRemoveImage}
                  className="text-red-600"
                  disabled={isLoading}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>

          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="govtId preview"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex justify-end items-center space-x-4">
          <Button
            variant="contained"
            disableElevation
            onClick={handleVerify}
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={!govtIdNumber || !selectedImage || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifygovtId;