import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, saveProfile } from '../api/apiRequests';
import { uploadImageToCloudinary } from '../utilis/UploadImageTocloudinary';
import { userGeneralInfo } from '../types/UserDTO';



export const useProfileSettings = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: userDetails, isLoading, error } = useQuery<userGeneralInfo, Error>({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation<
  userGeneralInfo,
    Error,
    { profile: userGeneralInfo; file?: File } // Accept profile and optional file
  >({
    mutationFn: async ({ profile, file }) => {
      console.log('Starting profile update mutation...');
      let profilePicture = profile.profilePicture;

      if (file) {
        console.log('Uploading new profile picture to Cloudinary...');
        profilePicture = await uploadImageToCloudinary(file, (errors: any) => {
          throw new Error(errors.imageUrl || 'Failed to upload image.');
        });
        if (!profilePicture) {
          throw new Error('Image upload failed');
        }
      } else {
        console.log('No new image provided, using existing profile picture:', profilePicture);
      }

      const updatedProfile: userGeneralInfo = {
        ...profile,
        profilePicture: profilePicture,
      };

      console.log('Saving profile:', updatedProfile);
      return saveProfile(userId,updatedProfile);
    },
    onSuccess: (updatedProfile) => {
      console.log('Profile update successful:', updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      queryClient.setQueryData(['userProfile', userId], updatedProfile);
    },
    onError: (err) => {
      console.error('Error updating profile:', err);
    },
  });

  return {
    userDetails,
    isLoading,
    error,
    updateProfile: (profile: userGeneralInfo, file?: File) =>
      updateProfileMutation.mutate({ profile, file }),
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
};