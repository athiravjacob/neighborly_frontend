// AadhaarVerification.tsx
import React, { useState, useRef } from 'react';
import { TextField, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface AadhaarVerificationProps {
  onVerify?: (verified: boolean) => void;
}

const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ onVerify }) => {
  const [aadharImage, setAadharImage] = useState<string | null>(null);
  const [aadharNumber, setAadharNumber] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  
  const aadharInputRef = useRef<HTMLInputElement>(null);

  const handleAadharUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAadharImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = () => {
    // In a real app, you would call an API here
    // This is just a simulation
    if (aadharNumber.length > 0 && aadharImage) {
      setIsVerified(true);
      if (onVerify) {
        onVerify(true);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Verify Aadhaar
      </label>
      <div className="flex items-center mb-2 text-sm text-gray-600">
        <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
          <div className="mr-2">🆔</div>
          <span>Aadhaar</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-grow">
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Aadhaar Number"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            size="small"
          />
        </div>
        <Button 
          variant="contained" 
          disableElevation 
          className={`${isVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} min-w-20`}
          onClick={handleVerify}
        >
          {isVerified ? 'Verified' : 'Verify'}
        </Button>
      </div>
      <div className="mt-4">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => aadharInputRef.current?.click()}
        >
          {aadharImage ? (
            <div className="relative">
              <img src={aadharImage} alt="Aadhaar" className="max-h-40 mx-auto" />
              <div className="mt-2 flex justify-center">
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setAadharImage(null);
                    setIsVerified(false);
                    if (onVerify) {
                      onVerify(false);
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <>
              <CloudUploadIcon className="text-gray-400 text-4xl" />
              <p className="mt-1 text-sm text-gray-500">
                Click to upload Aadhaar card image
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          ref={aadharInputRef}
          onChange={handleAadharUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default AadhaarVerification;