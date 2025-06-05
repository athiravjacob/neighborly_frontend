
import { useLocation, useNavigate } from "react-router-dom";
import { userGeneralInfo } from "../../../types/UserDTO";
import { useProfileSettings } from "../../../hooks/useProfileSettings";
import BanButton from "../../../components/admin/common/BanButton";

const ROUTES = {
  ADMIN_USERS: '/admin/dashboard/users',
};

const UserDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialUser = location.state?.user as userGeneralInfo | undefined;

  if (!initialUser) {
    return (
      <div className="p-8">
        <p className="text-red-500">User data not found.</p>
        <button
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          onClick={() => navigate(ROUTES.ADMIN_USERS)}
          aria-label="Back to users list"
        >
          Back to Users
        </button>
      </div>
    );
  }
  
  const { userDetails, isLoading, error } = useProfileSettings(initialUser.id!);
  console.log(userDetails)
  console.log(initialUser)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userDetails) {
    return <div>No user data found</div>;
  }

  return (
    <main className="flex-1 p-8">
      <button
        className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 mb-6 flex items-center"
        onClick={() => navigate(ROUTES.ADMIN_USERS)}
        aria-label="Back to users list"
      >
        <span className="text-xl mr-2">←</span>
        <span>Back to Users</span>
      </button>

      <div className="bg-gray-950 rounded-lg shadow-xl p-6 text-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-white">User Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {userDetails.profilePicture ? (
              <img
                src={userDetails.profilePicture}
                alt={`${userDetails.name || 'User'}'s profile`}
                className="w-64 h-64 rounded-full object-cover mx-auto mb-4 shadow-lg"
              />
            ) : (
              <div className="w-64 h-64 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-gray-400 text-xl">No Image</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <span className="font-semibold text-white block">Name:</span>
                <span>{userDetails.name || 'Not provided'}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-white block">Email:</span>
                <span>{userDetails.email || 'Not provided'}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-white block">Phone:</span>
                <span>{userDetails.phone || 'Not provided'}</span>
              </div>
            </div>

            <BanButton userId={initialUser.id!} isBanned={userDetails.isBanned!} type={'user'} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDetails;