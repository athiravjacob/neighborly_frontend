import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserInfo } from '../../../types/settings';
import { NeighborInfo } from '../../../types/neighbor';

const NeighborDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user as NeighborInfo;

    if (!user) {
        return (
            <main className="flex-1 p-8">
                <p className="text-red-500">No user data available. Please select a user from the list.</p>
                <button 
                    className="mt-4 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                    onClick={() => navigate('/admin/dashboard/neighbors')}
                >
                    Back to Neighbors List
                </button>
            </main>
        );
    }

    const handleBanUser = async () => {
        // Add your ban user API call here
        try {
            // Example: await banUser(user._id);
            alert(`User ${user.name} has been banned`);
        } catch (error) {
            alert('Failed to ban user');
        }
    };

    return (
      <main className="flex-1 p-8">
        <button
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 mb-6 flex items-center"
          onClick={() => navigate("/admin/dashboard/neighbors")}
        >
          <span className="text-xl mr-2">←</span>
          <span>Back to Neighbors</span>
        </button>

        <div className="bg-gray-950 rounded-lg shadow-xl p-6 text-gray-300">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-white">
              Neighbor Details
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Larger Image Section */}
            {/* <div className="lg:col-span-1">
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
                    </div> */}

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
                  <span>{user.phone || "Not provided"}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-white block">
                    ID Card:
                  </span>
                  <div className="lg:col-span-1">
                    {user.idCardImage ? (
                      <img
                        src={user.idCardImage}
                        alt={`${user.name}'s ID`}
                        className="w-64 h-64  object-cover mx-auto mb-4 shadow-lg"
                      />
                    ) : (
                      <div className="w-64 h-64  bg-gray-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-gray-400 text-xl">No ID provided</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-white block">
                    Verified:
                  </span>
                  <span
                    className={
                      user.isVerified ? "text-green-500" : "text-red-500"
                    }
                  >
                    {user.isVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-white block">
                    Service Location:
                  </span>
                  <span>{user.availableLocations.city || "Not provided"}</span>
                            </div>
                            <div className="mb-4">
                  <span className="font-semibold text-white block">
                    Location Radius:
                  </span>
                  <span>{user.availableLocations.re || "Not provided"}</span>
                </div>
                {/* <div className="mb-4">
                                <span className="font-semibold text-white block">Date of Birth:</span>
                                <span>{user.DOB ? new Date(user.DOB).toLocaleDateString() : 'Not provided'}</span>
                            </div> */}
              </div>

              <button
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleBanUser}
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      </main>
    );
};

export default NeighborDetails;