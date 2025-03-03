import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import UploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImageToCloudinary } from '../../utilis/UploadImageTocloudinary';
const VerifyAdhaar: React.FC = () => {
  const [adhaarNumber, setAdhaarNumber] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      setAdhaarNumber(value);
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
    }
  };

  const handleVerify = async() => {
    let image: string | null = null;
    if (imageFile) {
        image = await uploadImageToCloudinary(imageFile ,setError);
        if (!image) return;
      }
      console.log(image)
      setIsVerified(true); 
      // Simulate success for design purposes
  };

  if (isVerified) {
    return (
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-indigo-900">Aadhaar Verification</h2>
        </div>
        <div className="text-green-600 font-medium">Aadhaar Verified</div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-indigo-900">Verify Aadhaar</h2>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aadhaar Number
            </label>
            <TextField
              variant="outlined"
              fullWidth
              name="adhaarNumber"
              value={adhaarNumber}
              onChange={handleNumberChange}
              placeholder="Enter 12-digit Aadhaar number"
              size="small"
              inputProps={{ maxLength: 12 }}
              error={!!error && adhaarNumber.length > 0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Aadhaar Image
            </label>
            <div className="flex items-center gap-4">
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                className="text-indigo-600 border-indigo-600"
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {selectedImage && (
                <IconButton
                  onClick={handleRemoveImage}
                  className="text-red-600"
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
                alt="Aadhaar preview"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex justify-end">
          <Button
            variant="contained"
            disableElevation
            onClick={handleVerify}
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={!adhaarNumber || !selectedImage}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAdhaar;