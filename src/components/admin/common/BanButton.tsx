import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify'; // Optional: for notifications
import { updateBanStatus } from '../../../api/adminApiRequests';

interface BanButtonProps {
  userId: string;
  isBanned: boolean;
}

const BanButton: React.FC<BanButtonProps> = ({ userId, isBanned }) => {
  const queryClient = useQueryClient();

  // Define the mutation
  const mutation = useMutation({
    mutationFn: () => updateBanStatus(userId, 'user'),
    onSuccess: (data: boolean) => {
      // Invalidate the userProfile query to refetch user details
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast.success(`User ${data ? 'banned' : 'unbanned'} successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update ban status');
    },
  });

  // Handle button click
  const handleBanToggle = () => {
    mutation.mutate();
  };

  return (
    <button
      className={`px-4 py-2 text-white rounded ${
        isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
      }`}
      onClick={handleBanToggle}
      disabled={mutation.isPending}
      aria-label={isBanned ? 'Unban user' : 'Ban user'}
    >
      {mutation.isPending
        ? 'Processing...'
        : isBanned
        ? 'Unban User'
        : 'Ban User'}
    </button>
  );
};

export default BanButton;