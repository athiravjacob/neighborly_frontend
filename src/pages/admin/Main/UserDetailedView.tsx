import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserInfo } from '../../../types/settings';
import { banUnban } from '../../../api/adminApiRequests'; // Add fetchUser
import { getUser } from '../../../api/apiRequests';

const UserDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialUser = location.state?.user as UserInfo | undefined;

  // Fetch user data with useQuery
  const { data: user, isLoading, error: queryError } = useQuery({
    queryKey: ['user', initialUser?._id],
    queryFn: () => getUser(initialUser!._id), // API call to fetch user
    enabled: !!initialUser?._id, // Only fetch if _id exists
    initialData: initialUser, // Use location.state.user as initial data
  });

  if (isLoading) {
    return (
      <main className="flex-1 p-8">
        <p>Loading user data...</p>
      </main>
    );
  }

  if (!user || queryError) {
    return (
      <main className="flex-1 p-8">
        <p className="text-red-500">No user data available. Please select a user from the list.</p>
        <button
          className="mt-4 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          onClick={() => navigate('/admin/dashboard/users')}
        >
          Back to User List
        </button>
      </main>
    );
  }

  // React Query mutation for ban/unban
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => banUnban(user._id, 'user'),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', user._id] });

      // Snapshot the previous user data
      const previousUser = queryClient.getQueryData<UserInfo>(['user', user._id]);

      // Optimistically update the user data
      queryClient.setQueryData(['user', user._id], (old: UserInfo | undefined) => {
        if (!old) return old;
        return { ...old, isBanned: !old.isBanned }; // Toggle isBanned
      });

      // Return context for rollback
      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback to previous user data on error
      if (context?.previousUser) {
        queryClient.setQueryData(['user', user._id], context.previousUser);
      }
      alert(err.message || 'Failed to ban/unban user'); // Fix: Use err instead of error
    },
    onSuccess: (result) => {
      alert(`User ${user.name} has been ${result ? 'banned' : 'unbanned'}`);
    },
    onSettled: () => {
      // Invalidate queries to sync with server state
      queryClient.invalidateQueries({ queryKey: ['user', user._id] });
    },
  });

  const handleBanUser = () => {
    mutate();
  };

  return (
    <main className="flex-1 p-8">
      <button
        className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 mb-6 flex items-center"
        onClick={() => navigate('/admin/dashboard/users')}
      >
        <span className="text-xl mr-2">←</span>
        <span>Back to Users</span>
      </button>

      <div className="bg-gray-950 rounded-lg shadow-xl p-6 text-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-white">User Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Larger Image Section */}
          <div className="lg:col-span-1">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                className="w-64 h-64 rounded-full object-cover mx-auto mb-4 shadow-lg"
              />
            ) : (
              <div className="w-64 h-64 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-gray-400 text-xl">No Image</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <span className="font-semibold text-white block">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-white block">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-white block">Phone:</span>
                <span>{user.phone || 'Not provided'}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-white block">Date of Birth:</span>
                <span>{user.DOB ? new Date(user.DOB).toLocaleDateString() : 'Not provided'}</span>
              </div>
            </div>

            <button
              className={`mt-6 px-6 py-2 ${
                isPending ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              } text-white rounded`}
              onClick={handleBanUser}
              disabled={isPending}
            >
              {isPending ? 'Processing...' : user.isBanned ? 'Unban User' : 'Ban User'}
            </button>
            {isError && (
              <p className="mt-2 text-red-500">{error?.message || 'An error occurred'}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDetails;