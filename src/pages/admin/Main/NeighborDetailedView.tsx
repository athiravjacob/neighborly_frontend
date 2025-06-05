import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NeighborInfo } from '../../../types/neighbor';
import { verifyNeighbor } from '../../../api/adminApiRequests';
import { toast } from 'react-toastify';
import BanButton from '../../../components/admin/common/BanButton';

const NeighborDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user as NeighborInfo;
    console.log(user)

    if (!user) {
        return (
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
                    No user data available. Please select a user from the list.
                </div>
                <button 
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
                    onClick={() => navigate('/admin/dashboard/neighbors')}
                >
                    Back to Neighbors List
                </button>
            </main>
        );
    }

    const handleBanUser = async () => {
        try {
            alert(`User ${user.name} has been banned`);
        } catch (error) {
            alert('Failed to ban user');
        }
    };
  
    const handleVerifyNeighbor = async (neighborId:string) => {
        try {
            console.log(neighborId)
            const isVerified = await verifyNeighbor(neighborId)
            if(isVerified) toast.success("your are now a verified user")
        } catch (error) {
            console.log(error)
            alert('Failed to verify user');
        }
    };

    return (
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto bg-gray-900 text-gray-200">
      <button
          className="group flex items-center mb-6 text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200"
          onClick={() => navigate("/admin/dashboard/neighbors")}
      >
          <span className="text-xl mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span>Back to Neighbors</span>
      </button>
  
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-700 to-violet-900 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Neighbor Profile</h1>
              <div className="mt-2">
                  {user.isVerified ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600 bg-opacity-30 text-green-200">
                          Verified Account
                      </span>
                  ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-600 bg-opacity-30 text-yellow-200">
                          Pending Verification
                      </span>
                  )}
              </div>
          </div>
  
          <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-1">
                      <div className="bg-gray-700 p-6 rounded-lg border border-gray-600" key={user._id}>
                          <div className="w-24 h-24 rounded-full bg-violet-900 mx-auto flex items-center justify-center text-3xl font-bold text-violet-300 mb-4">
                              {user.name.charAt(0).toUpperCase()}
                          </div>
                          <h2 className="text-xl font-bold text-white text-center mb-6">{user.name}</h2>
  
                          <div className="space-y-4">
                              <div>
                                  <span className="text-sm text-gray-400 block">Email</span>
                                  <span className="font-medium text-white">{user.email}</span>
                              </div>
                              <div>
                                  <span className="text-sm text-gray-400 block">Phone</span>
                                  <span className="font-medium text-white">{user.phone || "Not provided"}</span>
                              </div>
                              <div>
                                  <span className="text-sm text-gray-400 block">Service Location</span>
                                  <span className="font-medium text-white">{user.availableLocation?.city || "Not provided"}</span>
                              </div>
                              <div>
                                  <span className="text-sm text-gray-400 block">Service Radius</span>
                                  <span className="font-medium text-white">{user.availableLocation?.radius || "5"} Kms</span>
                              </div>
                          </div>
                      </div>
  
                      <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-300 mb-3">Identity Verification</h3>
                          {user.idCardImage ? (
                              <div className="rounded-lg overflow-hidden border border-gray-600">
                                  <img
                                      src={user.idCardImage}
                                      alt={`${user.name}'s ID`}
                                      className="w-full h-48 object-cover"
                                  />
                              </div>
                          ) : (
                              <div className="w-full h-32 bg-gray-600 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">No ID Provided</span>
                              </div>
                          )}
                      </div>
                  </div>
  
                  {/* Right Column */}
                  <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Professional Skills</h3>
  
                      {user.skills.length > 0 ? (
                          <div className="space-y-4">
                              {user.skills.map((skill, index) => (
                                  <div
                                      key={index}
                                      className="bg-gray-700 p-5 rounded-lg border border-gray-600 hover:border-violet-400 transition-colors"
                                  >
                                      <div className="flex justify-between items-start">
                                          <div>
                                              <h4 className="font-semibold text-white">{skill.category}</h4>
                                              <p className="text-gray-400 text-sm">{skill.subcategories}</p>
                                          </div>
                                          <div className="bg-violet-800 text-violet-200 px-3 py-1 rounded-full text-sm font-medium">
                                              ${skill.hourlyRate}/hr
                                          </div>
                                      </div>
                                      {skill.description && (
                                          <p className="text-gray-400 text-sm mt-3">{skill.description}</p>
                                      )}
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="bg-gray-700 p-6 rounded-lg text-center">
                              <span className="text-gray-400">No skills listed</span>
                          </div>
                      )}
  
                      {/* Admin Actions */}
                      <div className="mt-8 pt-6 border-t border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-300 mb-4">Admin Actions</h3>
                          <div className="flex flex-wrap gap-3">
                                    <BanButton userId={user._id} isBanned={user.isBanned!} type={'neighbor'} />

  
                              {(!user.isVerified && user.idCardImage)&& (
                                  <>
                                            <button
                                                key={user._id}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                                                onClick={() => { handleVerifyNeighbor(user._id) }}
                                      >
                                          <span className="mr-2">✓</span>
                                          Verify Neighbor
                                      </button>
  
                                      {/* <button
                                          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                                          onClick={() => { handleVerifyNeighbor(user._id) }}
                                          >
                                          <span className="mr-2">✕</span>
                                          Reject Neighbor
                                      </button> */}
                                  </>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </main>
  
    );
};

export default NeighborDetails;