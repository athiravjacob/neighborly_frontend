import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Button, IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { RootState } from '../../redux/store';
import { fetchVerificationStatus, verifyId } from '../../api/apiRequests';
import { setVerificationStatus, setPendingStatus } from '../../redux/slices/verificationSlice';
import { uploadImageToCloudinary } from '../../utilis/UploadImageTocloudinary';

const Verification = () => {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { verificationStatus, isPending } = useSelector((state: RootState) => state.verification);

  // Fetch verification status with periodic refetch
  const { data: fetchedStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['verificationStatus', user?.id],
    queryFn: () => fetchVerificationStatus(),
    enabled: !!user?.id && !verificationStatus, // Skip if already verified
    refetchInterval: verificationStatus ? false : 30000, // Refetch every 30 seconds if not verified
  });

  // Update Redux state when fetched status changes
  useEffect(() => {
    if (fetchedStatus !== undefined) {
      dispatch(setVerificationStatus(fetchedStatus));
    }
  }, [fetchedStatus, dispatch]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
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
      setError('');
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!imageFile) {
        setError('No image selected');
        return;
      }

      const image = await uploadImageToCloudinary(imageFile, setError);
      if (!image) {
        setError('Image upload failed');
        return;
      }

      const response = await verifyId(image);
      dispatch(setVerificationStatus(response));
      dispatch(setPendingStatus(true)); // Set pending after successful upload
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If verification status is true, show verified message
  if (verificationStatus) {
    return (
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-indigo-900">Verify ID</h2>
        </div>
        <div className="text-green-600 font-medium">You are now a verified neighbor</div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-indigo-900">Verify ID</h2>
      </div>
      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          Please upload your ID card for verification. Only verified profiles get scheduled with tasks, so please upload a valid ID proof.
        </div>

        {!isPending && (
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
                disabled={isLoading || statusLoading}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading || statusLoading}
                />
              </Button>
              {selectedImage && (
                <IconButton
                  onClick={handleRemoveImage}
                  className="text-red-600"
                  disabled={isLoading || statusLoading}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="mt-4">
            <img
              src={selectedImage}
              alt="ID preview"
              className="max-w-xs rounded-lg shadow-md"
            />
          </div>
        )}

        {statusLoading && (
          <div className="text-gray-600 font-medium">Checking verification status...</div>
        )}

        {isPending && (
          <div className="text-yellow-600 font-medium">
            Your verification is pending, once admin verify we will notify. Please wait till then.
          </div>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {!isPending && (
          <div className="flex justify-end items-center space-x-4">
            <Button
              variant="contained"
              disableElevation
              onClick={handleUpload}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={!selectedImage || isLoading || statusLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;